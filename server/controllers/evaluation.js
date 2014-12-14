var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var constants = require('../constants');
var TableModel = require('../models/').TableModel;
var EvaluationModel = require('../models/').EvaluationModel;
var UserModel = require('../models/').UserModel;

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

            // extend: table -> root
            // 直接复制存在问题, 需要逐条复制
            var src1 = table.items,
                src2,
                src3,
                dest1 = root.items,
                dest2,
                dest3,
                key2,
                key3,
                ret = {};

            // 提取出所有item3条目
            // TODO 这里的key取值可能是有问题的
            _.each(src1, function(item1) {
                src2 = item1.items;
                _.each(src2, function(item2) {
                    src3 = item2.items;
                    key2 = [item1.index, item2.index].join('-');

                    ret[key2] = {
                        is_checked: item2.is_checked,
                        is_selected: item2.is_selected,
                    };
                    _.each(src3, function(item3) {
                        key3 = [item1.index, item2.index, item3.index].join('-');

                        ret[key3] = {
                            status: item3.status,
                            score: item3.score,
                            comments: item3.comments,
                            image_url: item3.image_url,
                            is_checked: item3.is_checked,
                            checked_items: item3.checked_items
                        };
                    });
                });
            });

            // 逐条复制给root
            _.each(dest1, function(item1) {
                dest2 = item1.items;
                _.each(dest2, function(item2) {
                    dest3 = item2.items;
                    key2 = [item1.index, item2.index].join('-');

                    _.extend(item2, ret[key2]);
                    _.each(dest3, function(item3) {
                        key3 = [item1.index, item2.index, item3.index].join('-');

                        _.extend(item3, ret[key3]);
                    });
                });
            });

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

        // 初始化流程
        evaluation.process.updateAt = Date.now();
        evaluation.process.active = false;
        evaluation.process.status = '';
        evaluation.process.process.user = req.session.user._id;

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
