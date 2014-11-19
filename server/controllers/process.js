var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var TableModel = require('../models/').TableModel;
var CheckModel = require('../models/').CheckModel;
var EvaluationModel = require('../models/').EvaluationModel;
var UserModel = require('../models/').UserModel;
var UnitModel = require('../models/').UnitModel;
var SegmentModel = require('../models/').SegmentModel;

// 流程启动
// 更新responsible，责任人
// 更新process.current, createAt, updateAt, active, status，流程状态和中间过程
exports.start = function (req, res, next) {
    var id = validator.trim(req.params.id);
    var nextUserId = validator.trim(req.params.next.user._id);
    var nextUnitId = validator.trim(req.params.next.unit._id);
    var comment = validator.trim(req.params.comment);

    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!id || !nextUnitId || !nextUserId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: nextUserId
        }
    };
};

// 逐级向下指派，捕获状态
// 更新process.current, sequences, archives, status
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
// 更新process.current, sequences, archives, status
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
// 更新process.current, archives, status
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
// 更新process.current, archives, status
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

// 流程结束
// 更新process.current, sequences, archives, active, status
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