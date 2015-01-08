var fs = require('fs');
var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var CaptureModel = require('../models/').CaptureModel;
var UserModel = require('../models/').UserModel;
var UnitModel = require('../models/').UnitModel;
var SegmentModel = require('../models/').SegmentModel;
var DocxGen = require('docxtemplater');
var ImageModule = require('docxtemplater-image-module');
var sizeOf = require('image-size');

exports.findAll = function(req, res, next) {
    var options = {};
    CaptureModel.findBy(options, function(err, captures) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'captures': captures
        });
    });
};

exports.findById = function(req, res, next) {
    var capture_id = validator.trim(req.params.capture_id);
    var options = {
        findOne: true,
        conditions: {
            _id: capture_id
        }
    };

    CaptureModel.findBy(options, function(err, capture) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'capture': capture
        });
    });
};

exports.findByProcessCurrentUserId = function(req, res, next) {
    var userId = validator.trim(req.params.userId);

    if (!userId) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            'process.current.user': userId
        }
    };

    CaptureModel.findBy(options, function(err, captures) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'captures': captures
        });
    });
};

exports.findByUser = function(req, res, next) {
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

    CaptureModel.findBy(options, function(err, captures) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'captures': captures
        });
    });
};

exports.findByDate = function(req, res, next) {
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
            createAt: {
                $gte: startDate,
                $lt: endDate
            }
        }
    };

    CaptureModel.findBy(options, function(err, captures) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'captures': captures
        });
    });
};

exports.delete = function(req, res, next) {
    var captureId = validator.trim(req.params.capture_id);

    var conditions = {
        _id: captureId
    };

    CaptureModel.findOneAndRemove(conditions, function(err, capture) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'capture': capture
        });
    });
};

exports.create = function(req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var capture = new CaptureModel(req.body);
    capture.uuid = Date.now();
    capture.createAt = Date.now();
    capture.updateAt = Date.now();

    // 初始化流程
    capture.process.updateAt = Date.now();
    capture.process.active = false;
    capture.process.status = '';
    capture.process.current.user = req.session.user._id;

    capture.save(function(err, capture) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'capture': capture
        });
    });
};




/////////////////////////////////////////////////////////////////

// 逐级向下指派，捕获状态
// 更新process.current, next, sequences, archives, status
exports.forward = function(req, res, next) {
    var captureId = validator.trim(req.params.capture_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!captureId || !req.body.process.current || !req.body.process.next) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: captureId
        }
    };

    CaptureModel.findBy(options, function(err, capture) {
        if (err) {
            return next(err);
        }

        if (!capture) {
            return next(utils.getError(102));
        }

        if (capture.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已下达之后的状态
        capture.process.active = true;
        capture.process.status = 'FORWARD'; // TODO
        capture.process.updateAt = Date.now();

        if (req.body.process.current.action === 'START') {
            capture.builder = req.body.builder;
            capture.supervisor = req.body.supervisor;
            capture.process.archives = capture.process.sequences = [];
        }

        // 采用A->A/B->A/B/C
        capture.process.current = req.body.process.next;
        capture.process.previous = req.body.process.current;
        capture.process.archives.push(req.body.process.current);
        capture.process.sequences.push(req.body.process.current);

        capture.save(function(err, capture) {
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
exports.backward = function(req, res, next) {
    var captureId = validator.trim(req.params.capture_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!captureId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: captureId
        }
    };

    CaptureModel.findBy(options, function(err, capture) {
        if (err) {
            return next(err);
        }

        if (!capture) {
            return next(utils.getError(102));
        }

        if (capture.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已反转或者已提交之后的状态
        capture.process.active = true;
        capture.process.status = 'BACKWARD'; // TODO
        capture.process.updateAt = Date.now();

        if (req.body.process.current.action === 'REVERSE') {}

        // 采用A/B/C -> A/B -> A -> []
        capture.process.current = capture.process.sequences.pop();
        capture.process.previous = req.body.process.current;
        capture.process.archives.push(req.body.process.current);

        capture.save(function(err, capture) {
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
exports.revert = function(req, res, next) {
    var captureId = validator.trim(req.params.capture_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!captureId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: captureId
        }
    };

    CaptureModel.findBy(options, function(err, capture) {
        if (err) {
            return next(err);
        }

        if (!capture) {
            return next(utils.getError(102));
        }

        if (capture.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已打回之后的状态
        capture.process.active = true;
        capture.process.status = 'REVERT';
        capture.process.updateAt = Date.now();

        capture.process.current = capture.process.previous;
        capture.process.previous = req.body.process.current;
        capture.process.archives.push(req.body.process.current);
        capture.process.sequences.push(req.body.process.current);

        capture.save(function(err, capture) {
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
exports.restore = function(req, res, next) {
    var captureId = validator.trim(req.params.capture_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!captureId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: captureId
        }
    };

    CaptureModel.findBy(options, function(err, capture) {
        if (err) {
            return next(err);
        }

        if (!capture) {
            return next(utils.getError(102));
        }

        if (capture.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已打回之后的状态
        capture.process.active = true;
        capture.process.status = 'BACKWARD';
        capture.process.updateAt = Date.now();

        capture.process.current = capture.process.sequences.pop();
        capture.process.previous = req.body.process.current;
        capture.process.archives.push(req.body.process.current);

        capture.save(function(err, capture) {
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
exports.end = function(req, res, next) {
    var captureId = validator.trim(req.params.capture_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!captureId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: captureId
        }
    };

    CaptureModel.findBy(options, function(err, capture) {
        if (err) {
            return next(err);
        }

        if (!capture) {
            return next(utils.getError(102));
        }

        capture.process.active = false;
        capture.process.status = 'END';
        capture.process.updateAt = Date.now();

        // 采用A/B/C -> A/B -> A -> []
        capture.process.archives.push(req.body.process.current);
        capture.process.sequences.pop();
        capture.process.current = null;
        capture.process.previous = null;

        capture.save(function(err, capture) {
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
    var captureId = validator.trim(req.params.capture_id);

    if (!captureId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: captureId
        }
    };

    CaptureModel.findBy(options, function(err, capture) {
        if (err) {
            return next(err);
        }

        if (!capture) {
            return next(utils.getError(102));
        }

        var file = 'AQJC';
        var ep = new eventproxy();
        ep.after('unit', capture.section.units.length, function(units) {

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

            var data = {
                "index": capture.uuid,
                "project": capture.project.name,
                "section": capture.section.name,
                "user": capture.user.name,
                "builder_user": capture.builder.user ? capture.builder.user.name : "",
                "builder_unit": _.find(units, {type: '施工单位'}) ? _.find(units, {type: '施工单位'}).name : "",
                "supervisor_user": capture.supervisor.user ? capture.supervisor.user.name : "",
                "supervisor_unit": _.find(units, {type: '监理单位'}) ? _.find(units, {type: '监理单位'}).name : ""
            };

            data.archives = _.map(capture.archives, function(item) {
                return {
                    level1: item.level1,
                    level3: item.level3,
                    object: item.object
                };
            });

            data.process = _.map(capture.process.archives, function(item) {
                return {
                    date: item.date,
                    user: item.user,
                    comment: item.comment
                };
            });

            data.first_process_comment = data.process ? data.process[0].comment : "";
            data.last_process_comment = data.process ? data.process[data.process.length - 1].comment : "";

            data.process = _.filter(data.process, function(item, index) {
                if (index === 0 || index === data.process.length - 1) return false;
                return true;
            });

            data.images = [];
            _.each(capture.archives, function(item) {
                _.each(item.images, function(image) {
                    data.images.push({
                        image: process.cwd() + '/public' + image.url,
                        object: item.object,
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
            fs.writeFile(process.cwd() + '/public/docx/' + capture._id + '_' + file + '.docx', buffer);

            res.send({
                'code': 0,
                'status': 'success',
                'files': [file]
            });
        });

        _.each(capture.section.units, function(unitId) {
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
