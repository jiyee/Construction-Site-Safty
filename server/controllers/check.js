var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var Table = require('../proxy/').Table;
var Check = require('../proxy/').Check;
var User = require('../proxy/').User;
var Unit = require('../proxy/').Unit;
var Part = require('../proxy/').Part;

exports.findAll = function (req, res, next) {
    return Check.findAll(function(err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'checks': checks
        });
    });
};

exports.findById = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'check': check
        });
    });
};

exports.findByUserId = function (req, res, next) {
    var user_id = validator.trim(req.params.user_id);

    if (!user_id) {
        return next(utils.getError(101));
    }

    return Check.findByProcessCurrentUserId(user_id, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'checks': checks
        });
    });
};

exports.findBySessionUser = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var user_id = req.session.user._id;

    return Check.findByProcessCurrentUserId(user_id, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'checks': checks
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

    // TODO 异步处理事件化，避免回调嵌套
    User.findById(next_user_id, function (err, user) {
        if (err) {
            return next(err);
        }

        var unit_id = user.unit._id;
        Part.findByUnitId(unit_id, function (err, part) {
            if (err) {
                return next(err);
            }

            if (part && part.is_leaf === true) {
                return next(utils.getError(104));
            }

            Check.findById(check_id, function(err, check) {
                if (err) {
                    return next(err);
                }

                if (check.process_active === false || 
                    check.process_status === 'END') {
                    return next(utils.getError(104));
                }

                check.process_active = true;
                check.process_status = 'FORWARD';

                var last_user_id = check.process_current_user;
                check.process_previous_user = last_user_id;
                check.process_current_user = next_user_id;
                check.process_flow_users.push(last_user_id);
                check.process_history_users.push(last_user_id);
                check.rectification_criterion = rectification_criterion;

                check.save();

                res.send({
                    'code': 0,
                    'check': check
                });
            });
        });
    });
};

// 逐级向上审核，冒泡状态
exports.backward = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!check_id) {
        return next(utils.getError(101));
    }

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
        }

        if (check.process_active === false || 
            check.process_status === 'END') {
            return next(utils.getError(104));
        }

        check.process_active = true;
        check.process_status = 'BACKWARD';

        var last_user_id = check.process_current_user;
        check.process_current_user = check.process_flow_users.pop();
        check.process_previous_user = last_user_id;
        // 采用A/B/C -> A/B -> A -> []
        // check.process_flow_users.push(last_user_id);
        check.process_history_users.push(last_user_id);

        check.save();

        res.send({
            'code': 0,
            'check': check
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

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
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

        check.save();

        res.send({
            'code': 0,
            'check': check
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

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
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

        check.save();

        res.send({
            'code': 0,
            'check': check
        });
    });
};

exports.end = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
        }

        check.process_active = false;
        check.process_status = 'END';

        var last_user_id = check.process_current_user;
        check.process_current_user = null;
        check.process_previous_user = null;
        check.process_flow_users.push(last_user_id);
        check.process_history_users.push(last_user_id);

        check.save();

        res.send({
            'code': 0
        });
    }); 
};

exports.delete = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
        }

        if (check.table && check.table._id) {
            Table.delete(check.table._id, function (err, table) {
                if (err) {
                    return next(err);
                }
            });
        }

        check.remove();

        res.send({
            'code': 0
        });
    });
};

exports.create = function (req, res, next) {
    var project_id = validator.trim(req.body.project_id);
    var part_id = validator.trim(req.body.part_id);
    var file = validator.trim(req.body.file);
    var check_target = validator.trim(req.body.check_target);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!project_id || !part_id || !file) {
        return next(utils.getError(101));
    }

    Table.newAndSave(file, function (err, table) {
        if (err) {
            return next(err);
        }

        if (!table) {
            return next(utils.getError(102));
        }

        Check.newAndSave(project_id, part_id, table._id, check_target, req.session.user._id, function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'code': 0,
                'check': check
            });
        });

        console.log("/check/create => new and save.");
    });
};
