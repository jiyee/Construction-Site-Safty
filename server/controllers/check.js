var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var TableModel = require('../models/').TableModel;
var CheckModel = require('../models/').CheckModel;
var UserModel = require('../models/').UserModel;
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

        res.send({
            'code': 0,
            'status': 'success',
            'check': check
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

        options.conditions.units = user.unit._id;
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

            options.conditions._id = check_id;
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
                check.process_previous_user = last_user_id;
                check.process_current_user = next_user_id;
                check.process_flow_users.push(last_user_id);
                check.process_history_users.push(last_user_id);
                check.rectification_criterion = rectification_criterion;

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

    var check = new CheckModel(req.body);
    check.check_user = req.session.user._id;

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
};
