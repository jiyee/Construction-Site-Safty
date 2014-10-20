var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var constants = require('../constants');
var TableModel = require('../models/').TableModel;
var EvaluationModel = require('../models/').EvaluationModel;
var UserModel = require('../models/').UserModel;

exports.findAll = function (req, res, next) {
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

exports.findById = function (req, res, next) {
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

    EvaluationModel.findBy(options, function (err, evaluation) {
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

exports.findByUserId = function (req, res, next) {
    var user_id = validator.trim(req.params.user_id);

    if (!user_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {   
            evaluation_users: user_id
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

exports.findBySessionUser = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var user_id = req.session.user._id;

    if (!user_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {   
            evaluation_users: user_id
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

exports.findByProjectId = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);

    if (!project_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {   
            project: project_id
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

exports.update = function (req, res, next) {
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
    ep.after('table', evaluation.tables.length, function (tables) {
        res.send({
            'status': 'success',
            'code': 0,
            'evaluation': evaluation
        });
    });

    _.each(evaluation.tables, function (table) {
        var options = {
            findOne: true,
            conditions: {   
                _id: table._id
            }
        };

        // 错误时性能消耗严重
        // BUG 存在返回JSON字符串最后'}'替换成了'H'
        // 移到table阶段检查数据合法性
        // var valid = true,
        //     err = "";
        // var list1 = table.items,
        //     list2,
        //     list3;
        // _.each(list1, function (item1) {
        //     if (/[A-Z]+/.test(item1.index)) {
        //         list2 = item1.items;

        //         _.each(list2, function (item2) {
        //             if (/[A-Z]+[0-9]+/.test(item2.index)) {
        //                 list3 = item2.items;

        //                 _.each(list3, function (item3) {
        //                     if (/[0-9]+/.test(item3.index)) {
        //                         if (!~constants.STATUS_TYPES.indexOf(item3.status)) {
        //                             err = "状态错误" + item3.status;
        //                             valid = false;
        //                             return;
        //                         }

        //                         if (item3.status === 'UNCHECK' && item3.score != null) {
        //                             err = "得分错误" + item3.score;
        //                             valid = false;
        //                             return;
        //                         }

        //                         if ((item3.status === 'PASS' && item3.score != '0') ||
        //                             (item3.status === 'FAIL' && item3.score == '0')) {
        //                             err = "得分错误" + item3.score;
        //                             valid = false;
        //                             return;
        //                         }
        //                     } else {
        //                         err = "索引错误" + item3.index;
        //                         valid = false;
        //                         return;
        //                     }
        //                 });
        //             } else {
        //                 err = "索引错误" + item2.index;
        //                 valid = false;
        //                 return;
        //             }
        //         });
        //     } else {
        //         err = "索引错误" + item1.index;
        //         valid = false;
        //         return;
        //     }
        // });

        // if (!valid) {
        //     return next({
        //         code: 103,
        //         message: err
        //     });
        // }

        TableModel.findBy(options, function(err, root) {

            // extend: table -> root
            // 直接复制存在问题, 需要逐条复制
            var src1 = table.items,
                src2,
                src3,
                dest1 = root.items,
                dest2,
                dest3,
                key,
                ret = {};

            // 提取出所有item3条目
            _.each(src1, function(item1) {
                src2 = item1.items;
                key = item1.index;
                _.each(src2, function(item2) {
                    src3 = item2.items;
                    key += "-" + item2.index;

                    ret[key] = {
                        is_checked: item2.is_checked,
                        is_selected: item2.is_selected,
                    };
                    _.each(src3, function(item3) {
                        key += "-" + item3.index;

                        ret[key] = {
                            status: item3.status,
                            score: item3.score,
                            comments: item3.comments,
                            image_url: item3.image_url,
                            is_checked: item3.is_checked,
                            checked: item3.checked
                        };
                    });
                });
            });

            // 逐条复制给root
            _.each(dest1, function(item1) {
                dest2 = item1.items;
                key = item1.index;
                _.each(dest2, function(item2) {
                    dest3 = item2.items;
                    key += "-" + item2.index;

                    _.extend(item2, ret[key]);
                    _.each(dest3, function(item3) {
                        key += "-" + item3.index;

                        _.extend(item3, ret[key]);
                    });
                });
            });

            // Mixed类型需要标记修改过的path
            root.markModified('items');

            root.save(function (err) {
                if (err) {
                    return next(err);
                }

                ep.emit('table');
            });

        });
    });

};

exports.create = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var ep = new eventproxy();

    var options = {
        conditions: {
            unit: req.session.user.unit._id 
        }
    };
    UserModel.findBy(options, function (err, users) {
        ep.emit('users', users);  
    });

    ep.on('users', function (users) {
        var files = ['SGJC', 'SGXCTY', 'SGXCGL', 'SGXCSY'];

        ep.after('table', files.length, function (tables) {
            var evaluation = new EvaluationModel(req.body);
            evaluation.evaluation_users = _.pluck(users, '_id');
            evaluation.uuid = Date.now(); 
            evaluation.tables = _.pluck(tables, '_id');

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

        var wbs = req.body.wbs;
        if (wbs) {
           var wbs_list = require('../data/wbs.json'); 
           var wbs_item = _.first(wbs_list, {"name": wbs});
           var wbs_files = wbs_item.files;

           // TODO 同步link
        }

        // 创建检查表
        _.each(files, function (file) {
            var table = new TableModel();
            var proto = require('../data/' + file + '.json');
            _.extend(table, proto);
            table.uuid = Date.now();
            table.save(function (err, table) {
                if (err) {
                    return next(err);
                }

                ep.emit('table', table);
            });
        });
    });

}; 