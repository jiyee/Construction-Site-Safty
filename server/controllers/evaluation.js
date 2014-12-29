var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var constants = require('../constants');
var TableModel = require('../models/').TableModel;
var EvaluationModel = require('../models/').EvaluationModel;
var UserModel = require('../models/').UserModel;
var DocxGen = require('docxtemplater');

exports.findAll = function(req, res, next) {
    var options = {};
    EvaluationModel.findBy(options, function(err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
        });
    });
};

exports.findById = function(req, res, next) {
    var evaluation_id = validator.trim(req.params.evaluation_id);

    if (!evaluation_id) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: evaluation_id
        }
    };

    EvaluationModel.findBy(options, function(err, evaluation) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluation': evaluation
        });
    });
};

exports.findByUserId = function(req, res, next) {
    var userId = validator.trim(req.params.userId);

    if (!userId) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            user: userId
        }
    };

    EvaluationModel.findBy(options, function(err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
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

    EvaluationModel.findBy(options, function (err, evaluations) {
        if (err) {
            return next(err);
        }

        // 不展示未扣分的考核评价
        evaluations = _.filter(evaluations, function(evaluation) {
            return _.filter(evaluation.archives, {linked: false}).length > 0;
        });

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
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
            user: userId
        }
    };

    EvaluationModel.findBy(options, function(err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
        });
    });
};

exports.findByProjectId = function(req, res, next) {
    var project_id = validator.trim(req.params.project_id);

    if (!project_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            project: project_id
        }
    };

    EvaluationModel.findBy(options, function(err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
        });
    });
};

exports.update = function(req, res, next) {
    var evaluation_id = validator.trim(req.params.evaluation_id);
    var evaluation = validator.trim(req.body.evaluation);

    if (validator.isNull(evaluation_id) || validator.isNull(evaluation)) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    // 检查evaluation数据格式正确性
    try {
        evaluation = JSON.parse(evaluation);
    } catch (ex) {
        return next({
            code: 103,
            message: ex
        });
    }

    if (!evaluation ||
        !evaluation.tables ||
        evaluation.tables.length === 0) {
        return next({
            code: 103,
            message: '数据错误'
        });
    }

    var ep = new eventproxy();
    ep.after('table', evaluation.tables.length, function(tables) {
        res.send({
            'status': 'success',
            'code': 0,
            'evaluation': evaluation
        });
    });

    _.each(evaluation.tables, function(table) {
        var options = {
            findOne: true,
            conditions: {
                _id: table._id
            }
        };

        TableModel.findBy(options, function(err, root) {

            // Mixed类型需要标记修改过的path
            root.markModified('items');

            root.save(function(err) {
                if (err) {
                    return next(err);
                }

                ep.emit('table');
            });

        });
    });

};

exports.create = function(req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var ep = new eventproxy();
    var files = ['SGJC', 'SGXCTY', 'SGXCGL', 'SGXCSY'];

    ep.after('table', req.body.tables.length, function(tables) {
        var evaluation = new EvaluationModel(_.omit(req.body, 'tables'));
        evaluation.uuid = Date.now();
        evaluation.tables = _.pluck(tables, '_id');
        evaluation.user = req.session.user._id;

        // 未扣分的考核评价直接终止流程
        if (evaluation.archives &&
            _.filter(evaluation.archives, {linked: false}).length === 0) {
            // 终止流程
            evaluation.process.updateAt = Date.now();
            evaluation.process.active = false;
            evaluation.process.status = 'END';
        } else {
            // 初始化流程
            evaluation.process.updateAt = Date.now();
            evaluation.process.active = false;
            evaluation.process.status = '';
            evaluation.process.current.user = req.session.user._id;
        }

        evaluation.save(function(err, evaluation) {
            if (err) {
                return next(err);
            }

            res.send({
                'status': 'success',
                'code': 0,
                'evaluation': evaluation
            });
        });
    });

    // 创建检查表，更新表内容
    _.each(files, function(file) {
        if (_.isEmpty(_.find(req.body.tables, {'file': file}))) {
           return;
        }

        var table = new TableModel();
        table.uuid = Date.now();
        _.extend(table, _.find(req.body.tables, {'file': file}));

        table.save(function(err, table) {
            if (err) {
                return next(err);
            }

            ep.emit('table', table);
        });
    });

};


/////////////////////////////////////////////////////////////////

// 逐级向下指派，捕获状态
// 更新process.current, next, sequences, archives, status
exports.forward = function (req, res, next) {
    var evaluationId = validator.trim(req.params.evaluation_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!evaluationId || !req.body.process.current || !req.body.process.next) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: evaluationId
        }
    };

    EvaluationModel.findBy(options, function(err, evaluation) {
        if (err) {
            return next(err);
        }

        if (!evaluation) {
            return next(utils.getError(102));
        }

        if (evaluation.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已下达之后的状态
        evaluation.process.active = true;
        evaluation.process.status = 'FORWARD'; // TODO
        evaluation.process.updateAt = Date.now();

        if (req.body.process.current.action === 'START') {
            evaluation.builder = req.body.builder;
            evaluation.supervisor = req.body.supervisor;
            evaluation.process.archives = evaluation.process.sequences = [];
        }

        // 采用A->A/B->A/B/C
        evaluation.process.current = req.body.process.next;
        evaluation.process.previous = req.body.process.current;
        evaluation.process.archives.push(req.body.process.current);
        evaluation.process.sequences.push(req.body.process.current);

        evaluation.save(function(err, evaluation) {
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
    var evaluationId = validator.trim(req.params.evaluation_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!evaluationId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: evaluationId
        }
    };

    EvaluationModel.findBy(options, function(err, evaluation) {
        if (err) {
            return next(err);
        }

        if (!evaluation) {
            return next(utils.getError(102));
        }

        if (evaluation.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已反转或者已提交之后的状态
        evaluation.process.active = true;
        evaluation.process.status = 'BACKWARD'; // TODO
        evaluation.process.updateAt = Date.now();

        if (req.body.process.current.action === 'REVERSE') {
        }

        // 采用A/B/C -> A/B -> A -> []
        evaluation.process.current = evaluation.process.sequences.pop();
        evaluation.process.previous = req.body.process.current;
        evaluation.process.archives.push(req.body.process.current);

        evaluation.save(function(err, evaluation) {
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
    var evaluationId = validator.trim(req.params.evaluation_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!evaluationId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: evaluationId
        }
    };

    EvaluationModel.findBy(options, function(err, evaluation) {
        if (err) {
            return next(err);
        }

        if (!evaluation) {
            return next(utils.getError(102));
        }

        if (evaluation.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已打回之后的状态
        evaluation.process.active = true;
        evaluation.process.status = 'REVERT';
        evaluation.process.updateAt = Date.now();

        evaluation.process.current = evaluation.process.previous;
        evaluation.process.previous = req.body.process.current;
        evaluation.process.archives.push(req.body.process.current);
        evaluation.process.sequences.push(req.body.process.current);

        evaluation.save(function(err, evaluation) {
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
    var evaluationId = validator.trim(req.params.evaluation_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!evaluationId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: evaluationId
        }
    };

    EvaluationModel.findBy(options, function(err, evaluation) {
        if (err) {
            return next(err);
        }

        if (!evaluation) {
            return next(utils.getError(102));
        }

        if (evaluation.process.status === 'END') {
            return next(utils.getError(104));
        }

        // 设置已打回之后的状态
        evaluation.process.active = true;
        evaluation.process.status = 'BACKWARD';
        evaluation.process.updateAt = Date.now();

        evaluation.process.current = evaluation.process.sequences.pop();
        evaluation.process.previous = req.body.process.current;
        evaluation.process.archives.push(req.body.process.current);

        evaluation.save(function(err, evaluation) {
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
    var evaluationId = validator.trim(req.params.evaluation_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!evaluationId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: evaluationId
        }
    };

    EvaluationModel.findBy(options, function(err, evaluation) {
        if (err) {
            return next(err);
        }

        if (!evaluation) {
            return next(utils.getError(102));
        }

        evaluation.process.active = false;
        evaluation.process.status = 'END';
        evaluation.process.updateAt = Date.now();

        // 采用A/B/C -> A/B -> A -> []
        evaluation.process.archives.push(req.body.process.current);
        evaluation.process.sequences.pop();
        evaluation.process.current = null;
        evaluation.process.previous = null;

        evaluation.save(function(err, evaluation) {
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
    var evaluation_id = validator.trim(req.params.evaluation_id);

    if (!evaluation_id) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: evaluation_id
        }
    };

    EvaluationModel.findBy(options, function(err, evaluation) {
        if (err) {
            return next(err);
        }

        var ep = new eventproxy();
        var files = ['SGJC', 'SGXCTY', 'SGXCGL', 'SGXCSY'];

        ep.after('file', files.length, function(files) {
           res.send({
               'code': 0,
               'status': 'success',
               'files': files,
               'evaluation': evaluation
           });
        });

        var table;
        var data;

        // 创建检查表，更新表内容
        _.each(files, function(file) {
            table = _.find(evaluation.tables, {'file': file});

            if (_.isEmpty(table)) {
                ep.emit('file', {});
                return;
            }

            data = {
                'PROJECT': evaluation.project.name,
                'SECTION': evaluation.section.name,
                'BUILDER': ''
            };

            _.each(table.items, function (level1) {
                selected = false;
                _.each(level1.items, function (level2) {
                    if (level2.is_selected) selected = true;
                    level2.score = 0;
                    _.each(level2.items, function (level3) {
                        if (level3.status === 'FAIL') {
                            level2.score += parseInt(level3.score, 10);
                            data[[file, level1.index, level2.index, level3.index].join('-')] = parseInt(level3.score, 10);
                        } else if (level3.status === 'PASS') {
                            data[[file, level1.index, level2.index, level3.index].join('-')] = '-';
                        } else if (level3.status === 'UNCHECK') {
                            data[[file, level1.index, level2.index, level3.index].join('-')] = '-';
                        }
                    });

                    level2.score = Math.min(level2.score, level2.maximum);
                    data[[file, level1.index, level2.index].join('-')] = Math.min(level2.score, level2.maximum);
                });

                // 计算应得分
                if (selected) {
                    // $scope.data.score[type].total += level1.maximum;
                }
            });

            var docx = new DocxGen().loadFromFile(process.cwd() + '/templates/' + file + '.docx');

            docx.setTags(data);
            docx.applyTags();
            docx.output({
                name: '/docx/' + evaluation._id + '_' + file + '.docx'
            });

            ep.emit('file', data);
        });

    });
};