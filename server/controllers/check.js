var fs = require('fs');
var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var TableModel = require('../models/').TableModel;
var CheckModel = require('../models/').CheckModel;
var UserModel = require('../models/').UserModel;
var UnitModel = require('../models/').UnitModel;
var SegmentModel = require('../models/').SegmentModel;
var DocxGen = require('docxtemplater');
var ImageModule = require('docxtemplater-image-module');
var sizeOf = require('image-size');

exports.findAll = function (req, res, next) {
    var options = {};
    CheckModel.findBy(options, function(err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

exports.findById = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    if (!checkId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: checkId
        }
    };

    CheckModel.findBy(options, function (err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        res.send({
            'code': 0,
            'status': 'success',
            'check': check
        });
    });
};

exports.findByProcessCurrentUserId = function (req, res, next) {
    var userId = validator.trim(req.params.userId);

    if (!userId) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            'process.current.user': userId
        }
    };

    CheckModel.findBy(options, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

exports.findByUser = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var userId = req.session.user._id;

    if (!userId) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            'user': userId
        }
    };

    CheckModel.findBy(options, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

// TODO 递归查询项目-标段-分部管辖下的所有日常巡查记录
// TODO 测试结果正确性
exports.findByDate = function (req, res, next) {
    var projectId = validator.trim(req.params.project_id);
    var sectionId = validator.trim(req.params.section_id);
    var startDate = validator.trim(req.params.start_date);
    var endDate = validator.trim(req.params.end_date);

    if (!projectId || !sectionId || !startDate || !endDate) {
        return next(utils.getError(101));
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    endDate = endDate.setDate(endDate.getDate() + 1);

    var options = {
        conditions: {
            project: projectId,
            section: sectionId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }
    };

    // 找出所在项目、标段、分部管辖下所有的日常巡查记录
    CheckModel.findBy(options, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

exports.delete = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    var conditions = {
        _id: checkId
    };

    CheckModel.findOneAndRemove(conditions, function (err, check) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'check': check
        });
    });
};

exports.create = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!req.body.file) {
        return next(utils.getError(102));
    }

    var ep = new eventproxy();
    ep.on('table', function (table) {
        var check = new CheckModel(_.omit(req.body, 'table'));
        check.uuid = Date.now();
        check.table = table._id;
        check.user = req.session.user._id;

        // 初始化流程
        check.process.updateAt = Date.now();
        check.process.active = false;
        check.process.status = '';
        check.process.current.user = req.session.user._id;

        check.save(function(err, newCheck) {
            if (err) {
                return next(err);
            }

            res.send({
                'status': 'success',
                'code': 0,
                'check': newCheck
            });
        });
    });

    // 创建日常巡检表，更新检查表内容
    var table = new TableModel();
    table.uuid = Date.now();
    _.extend(table, req.body.table);

    table.save(function (err, newTable) {
        if (err) {
            return next(err);
        }

        ep.emit('table', newTable);
    });

};

/////////////////////////////////////////////////////////////////

// 逐级向下指派，捕获状态
// 更新process.current, next, sequences, archives, status
exports.forward = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!checkId || !req.body.process.current || !req.body.process.next) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: checkId
        }
    };

    CheckModel.findBy(options, function(err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        if (check.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已下达之后的状态
        check.process.active = true;
        check.process.status = 'FORWARD'; // TODO
        check.process.updateAt = Date.now();

        if (req.body.process.current.action === 'START') {
            check.builder = req.body.builder;
            check.supervisor = req.body.supervisor;
            check.process.archives = check.process.sequences = [];
        }

        // 采用A->A/B->A/B/C
        check.process.current = req.body.process.next;
        check.process.previous = req.body.process.current;
        check.process.archives.push(req.body.process.current);
        check.process.sequences.push(req.body.process.current);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success'
            });
        });
    });
};

// 逐级向上审核，冒泡状态
// 更新process.current, sequences, archives, status
exports.backward = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!checkId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: checkId
        }
    };

    CheckModel.findBy(options, function(err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        if (check.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已反转或者已提交之后的状态
        check.process.active = true;
        check.process.status = 'BACKWARD'; // TODO
        check.process.updateAt = Date.now();

        if (req.body.process.current.action === 'REVERSE') {
        }

        // 采用A/B/C -> A/B -> A -> []
        check.process.current = check.process.sequences.pop();
        check.process.previous = req.body.process.current;
        check.process.archives.push(req.body.process.current);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success'
            });
        });
    });
};

// 流程打回，处于暂停状态
// 更新process.current, archives, status
exports.revert = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!checkId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: checkId
        }
    };

    CheckModel.findBy(options, function(err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        if (check.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已打回之后的状态
        check.process.active = true;
        check.process.status = 'REVERT';
        check.process.updateAt = Date.now();

        check.process.current = check.process.previous;
        check.process.previous = req.body.process.current;
        check.process.archives.push(req.body.process.current);
        check.process.sequences.push(req.body.process.current);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success'
            });
        });
    });
};

// 流程恢复, 继续执行
// 更新process.current, archives, status
exports.restore = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!checkId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: checkId
        }
    };

    CheckModel.findBy(options, function(err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        if (check.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已打回之后的状态
        check.process.active = true;
        check.process.status = 'BACKWARD';
        check.process.updateAt = Date.now();

        check.process.current = check.process.sequences.pop();
        check.process.previous = req.body.process.current;
        check.process.archives.push(req.body.process.current);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success'
            });
        });
    });
};

// 流程结束
// 更新process.current, sequences, archives, active, status
exports.end = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!checkId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: checkId
        }
    };

    CheckModel.findBy(options, function(err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        check.process.active = false;
        check.process.status = 'END';
        check.process.updateAt = Date.now();

        // 采用A/B/C -> A/B -> A -> []
        check.process.archives.push(req.body.process.current);
        check.process.sequences.pop();
        check.process.current = null;
        check.process.previous = null;

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success'
            });
        });
    });
};

exports.docxgen = function(req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    if (!check_id) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: check_id
        }
    };

    CheckModel.findBy(options, function(err, check) {
        if (err) {
            return next(err);
        }

        var ep = new eventproxy();
        ep.after('unit', check.section.units.length, function(units) {
            // 最终回调出口
            ep.all('file', function(file) {
                res.send({
                    'code': 0,
                    'status': 'success',
                    'files': [file]
                });
            });

            var data;

            // 创建整改通知书
            ///////////////////////////
            var file = 'RCXJ';
            var content = fs.readFileSync(process.cwd() + '/templates/' + file + '.docx', "binary");
            var docx = new DocxGen(content);

            var imageModule = new ImageModule({
                centered: true
            });
            imageModule.getSizeFromData = function(imgData) {
                sizeObj = sizeOf(imgData);
                var ratio = sizeObj.width / sizeObj.height;
                var maxWidth = Math.min(sizeObj.width, 480);
                var maxHeight = maxWidth / ratio;
                return [maxWidth, maxHeight];
            };

            docx.attachModule(imageModule);

            data = {
                "index": check.uuid,
                "project": check.project.name,
                "section": check.section.name,
                "user": check.user.name,
                "builder_user": check.builder.user ? check.builder.user.name : "",
                "builder_unit": _.find(units, {type: '施工单位'}) ? _.find(units, {type: '施工单位'}).name : "",
                "supervisor_user": check.supervisor.user ? check.supervisor.user.name : "",
                "supervisor_unit": _.find(units, {type: '监理单位'}) ? _.find(units, {type: '监理单位'}).name : ""
            };

            data.archives = [];
            _.each(check.table.items, function(level1) {
                _.each(level1.items, function(level2) {
                    _.each(level2.items, function(level3) {
                        if (level3.status != 'UNCHECK' && level3.score > 0) {
                            data.archives.push({
                                index: level3.index,
                                name: level3.name,
                                comment: level3.comments || "",
                                images: level3.images
                            });
                        }
                    });
                });
            });

            data.process = _.map(check.process.archives, function(item) {
                return {
                    date: item.date,
                    user: item.user,
                    comment: item.comment || ""
                };
            });

            data.first_process_comment = data.process ? data.process[0].comment : "";
            data.last_process_comment = data.process ? data.process[data.process.length - 1].comment : "";

            data.process = _.filter(data.process, function(item, index) {
                if (index === 0 || index === data.process.length - 1) return false;
                return true;
            });

            data.images = [];
            _.each(check.archives, function(item) {
                _.each(item.images, function(image) {
                    data.images.push({
                        image: process.cwd() + '/public' + image.url,
                        name: item.name,
                        comment: item.comment || ""
                    });
                });
            });
            // res.send(data);return;

            docx.setData(data);
            docx.render();

            var buffer = docx.getZip().generate({
                type: "nodebuffer"
            });
            fs.writeFile(process.cwd() + '/public/docx/' + check._id + '_' + file + '.docx', buffer);

            ep.emit('file', file);
        });

        _.each(check.section.units, function(unitId) {
            UnitModel.findBy({
                findOne: true,
                conditions: {
                    _id: unitId
                }
            }, function(err, unit) {
                if (err) {
                    ep.emit('unit', null);
                }

                ep.emit('unit', unit);
            });
        });

    });
};