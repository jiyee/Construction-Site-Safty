var validator = require('validator');
var eventproxy = require('eventproxy');
var Table = require('../proxy/').Table;
var Check = require('../proxy/').Check;

exports.find = function (req, res, next) {
    return Check.find(function(err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
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
            'status': 'success',
            'code': 0,
            'check': check
        });
    });
};

exports.findByUserId = function (req, res, next) {
    var user_id = validator.trim(req.params.user_id);

    if (!user_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    return Check.findByProcessCurrentUserId(user_id, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'checks': checks
        });
    });
};

exports.findBySessionUserId = function (req, res, next) {
    if (!req.session.user) {
        return next({
            code: 105,
            message: '用户未登录'
        });
    }

    var user_id = req.session.user._id;

    return Check.findByProcessCurrentUserId(user_id, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'checks': checks
        });
    });
};

exports.forward = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);
    var next_user_id = validator.trim(req.body.next_user_id);

    if (!req.session.user) {
        return next({
            code: 105,
            message: '用户未登录'
        });
    }

    if (!check_id || !next_user_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
        }

        if (check.process_active === false || 
            check.process_status === 'END') {
            return next({
                code: 104,
                message: '状态错误'
            });
        }

        check.process_active = true;
        check.process_status = 'FORWARD';
        var last_user_id = check.process_current_user;
        check.process_previous_user = last_user_id;
        check.process_current_user = next_user_id;
        check.process_flow_users.push(last_user_id);

        check.save();

        res.send({
            'status': 'success',
            'code': 0
        });
    });
};

exports.backward = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    if (!req.session.user) {
        return next({
            code: 105,
            message: '用户未登录'
        });
    }

    if (!check_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
        }

        if (check.process_active === false || 
            check.process_status === 'END') {
            return next({
                code: 104,
                message: '状态错误'
            });
        }

        check.process_active = true;
        check.process_status = 'BACKWARD';
        var last_user_id = check.process_previous_user;
        check.process_previous_user = check.process_current_user;
        check.process_current_user = last_user_id;
        check.process_flow_users.push(last_user_id);

        check.save();

        res.send({
            'status': 'success',
            'code': 0
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

        check.save();

        res.send({
            'status': 'success',
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
            'status': 'success',
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
        return next({
            code: 105,
            message: '用户未登录'
        });
    }

    if (!project_id || !part_id || !file) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    Table.newAndSave(file, function (err, table) {
        if (err) {
            return next(err);
        }

        if (!table) {
            return next({
                code: 102,
                message: '对象不存在'
            });
        }

        Check.newAndSave(project_id, part_id, table._id, check_target, req.session.user._id, function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'status': 'success',
                'code': 0,
                'check': check
            });
        });

        console.log("/check/create => new and save.");
    });
};
