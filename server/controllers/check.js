var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var TableModel = require('../models/').TableModel;
var CheckModel = require('../models/').CheckModel;
var UserModel = require('../models/').UserModel;
var UnitModel = require('../models/').UnitModel;
var SegmentModel = require('../models/').SegmentModel;

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

    CheckModel.findBy(options, function (err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        var ep = new eventproxy();
        ep.all('check_user.unit', function() {
            res.send({
                'code': 0,
                'status': 'success',
                'check': check
            });
        });

        UnitModel.populate(check.check_user, {
            path: 'unit'
        }, function (err, user) {
            ep.emit('check_user.unit');
        });
    });
};

exports.findByProcessCurrentUserId = function (req, res, next) {
    var user_id = validator.trim(req.params.user_id);

    if (!user_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            process_current_user: user_id
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
            process_current_user: user_id
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

exports.findByDateInterval = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var segment_id = validator.trim(req.params.segment_id);
    var start_date = validator.trim(req.params.start_date);
    var end_date = validator.trim(req.params.end_date);

    if (!project_id || !segment_id || !start_date || !end_date) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            project: project_id,
            check_date: {
                $gte: new Date(start_date),
                $lt: new Date(end_date)
            }
        },
        select: 'table section branch check_user check_date'
    };

    CheckModel.findBy(options, function (err, checks) {
        if (err) {
            return next(err);
        }

        var ep = new eventproxy();
        var lge_segment_checks = [];

        ep.all('check_user', 'segment_tree', function () {
            res.send({
                'code': 0,
                'status': 'success',
                'checks': lge_segment_checks
            });
        });

        // TODO 优化成循环模式
        ep.after('segment.parent.parent', checks.length, function () {
            _.each(checks, function (check) {
                if (check.segment._id == segment_id) {
                    lge_segment_checks.push(check);
                }

                var parent = check.segment.parent;
                while (parent) {
                    if (parent._id == segment_id) {
                        lge_segment_checks.push(check);
                        break;
                    } else {
                        parent = parent.parent;
                    }
                }
            });

            ep.emit('segment_tree');
        });

        ep.after('segment.parent', checks.length, function () {
            _.each(checks, function (check) {
                if (!check.segment.parent) {
                    ep.emit('segment.parent.parent');
                    return;
                }

                SegmentModel.populate(check.segment.parent, {
                    path: 'parent'
                }, function (err, segment) {
                    ep.emit('segment.parent.parent');
                });
            });
        });

        _.each(checks, function (check) {
            if (!check.segment.parent) {
                ep.emit('segment.parent');
                return;
            }

            SegmentModel.populate(check.segment, {
                path: 'parent'
            }, function (err, segment) {
                ep.emit('segment.parent');
            });

            UnitModel.populate(check.check_user, {
                path: 'unit'
            }, function (err, check_user) {
                ep.emit('check_user');
            });
        });



    });
};

// 逐级向下指派，捕获状态
exports.forward = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);
    var next_user_id = validator.trim(req.body.next_user_id);
    var rectification_criterion = validator.trim(req.body.rectification_criterion);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!check_id || !next_user_id) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: next_user_id
        }
    };

    // TODO 异步处理事件化，避免回调嵌套
    UserModel.findBy(options, function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next(utils.getError(102));
        }

        options = {
            findOne: true,
            conditions: {
                units: user.unit._id
            }
        };
        SegmentModel.findBy(options, function (err, segment) {
            if (err) {
                return next(err);
            }

            if (!segment) {
                return next(utils.getError(102));
            }

            if (segment && segment.is_leaf === true) {
                return next(utils.getError(104));
            }

            options = {
                findOne: true,
                conditions: {
                    _id: check_id
                }
            };
            CheckModel.findBy(options, function(err, check) {
                if (err) {
                    return next(err);
                }

                if (!check) {
                    return next(utils.getError(102));
                }

                if (check.process_active === false ||
                    check.process_status === 'END') {
                    return next(utils.getError(104));
                }

                check.process_active = true;
                check.process_status = 'FORWARD';

                if (rectification_criterion) {
                    check.rectification_criterion = rectification_criterion;
                }

                var last_user_id = check.process_current_user;
                check.process_previous_user = last_user_id;
                check.process_current_user = next_user_id;
                check.process_flow_users.push(last_user_id);
                check.process_history_users.push(last_user_id);

                check.save(function(err, check) {
                    if (err) {
                        return next(err);
                    }

                    res.send({
                        'code': 0,
                        'status': 'success',
                        'check': check
                    });
                });
            });
        });
    });
};

// 逐级向上审核，冒泡状态
exports.backward = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);
    var rectification_result = validator.trim(req.body.rectification_result);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

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

        if (!check) {
            return next(utils.getError(102));
        }

        if (check.process_active === false ||
            check.process_status === 'END') {
            return next(utils.getError(104));
        }

        check.process_active = true;
        check.process_status = 'BACKWARD';

        if (rectification_result) {
            check.rectification_result = rectification_result;
        }

        var last_user_id = check.process_current_user;
        check.process_current_user = check.process_flow_users.pop();
        check.process_previous_user = last_user_id;
        // 采用A/B/C -> A/B -> A -> []
        // check.process_flow_users.push(last_user_id);
        check.process_history_users.push(last_user_id);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success',
                'check': check
            });
        });
    });
};

// 流程打回，处于暂停状态
exports.revert = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

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

        if (!check) {
            return next(utils.getError(102));
        }

        if (check.process_active === false ||
            check.process_status === 'END') {
            return next(utils.getError(104));
        }

        check.process_active = true;
        check.process_status = 'REVERT';

        var last_user_id = check.process_current_user;
        check.process_current_user = check.process_previous_user;
        check.process_previous_user = last_user_id;
        check.process_flow_users.pop();
        check.process_history_users.push(last_user_id);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success',
                'check': check
            });
        });
    });
};

// 流程恢复, 继续执行
exports.restore = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

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

        if (!check) {
            return next(utils.getError(102));
        }

        if (check.process_active === false ||
            check.process_status === 'END') {
            return next(utils.getError(104));
        }

        check.process_active = true;
        check.process_status = 'FORWARD';

        var last_user_id = check.process_current_user;
        check.process_current_user = check.process_previous_user;
        check.process_previous_user = last_user_id;
        check.process_flow_users.push(last_user_id);
        check.process_history_users.push(last_user_id);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success',
                'check': check
            });
        });
    });
};

exports.end = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

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

        if (!check) {
            return next(utils.getError(102));
        }

        check.process_active = false;
        check.process_status = 'END';

        var last_user_id = check.process_current_user;
        check.process_current_user = null;
        check.process_previous_user = null;
        check.process_flow_users.push(last_user_id);
        check.process_history_users.push(last_user_id);

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'status': 'success',
                'check': check
            });
        });
    });
};

exports.delete = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    var conditions = {
        _id: check_id
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
        var check = new CheckModel(req.body);
        check.check_user = req.session.user._id;
        check.process_current_user = req.session.user._id;
        check.uuid = Date.now();
        check.table = table._id;

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'status': 'success',
                'code': 0,
                'check': check
            });
        });
    });

    // 创建日常巡检表
    var table = new TableModel();
    var proto = require('../data/' + req.body.file + '.json');
    _.extend(table, proto);
    table.uuid = Date.now();
    table.save(function (err, table) {
        if (err) {
            return next(err);
        }

        ep.emit('table', table);
    });

};
