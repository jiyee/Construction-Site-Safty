var validator = require('validator');
var eventproxy = require('eventproxy');
var UserModel = require('../models/').UserModel;

exports.findAll = function(req, res, next) {
    var options = {};
    UserModel.findBy(options, function(err, users) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'users': users
        });
    });
};

exports.findById = function(req, res, next) {
    var userId = validator.trim(req.params.userId);
    var options = {
        findOne: true,
        conditions: {
            _id: userId
        }
    };

    UserModel.findBy(options, function(err, user) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'user': user
        });
    });
};

exports.findByName = function(req, res, next) {
    var user_name = validator.trim(req.params.user_name);
    var options = {
        findOne: true,
        conditions: {
            name: user_name
        }
    };

    UserModel.findBy(options, function(err, user) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'user': user
        });
    });
};

exports.findByRole = function(req, res, next) {
    var role = validator.trim(req.params.role);
    var options = {
        conditions: {
            role: role
        }
    };

    UserModel.findBy(options, function(err, users) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'users': users
        });
    });
};

exports.findByUnitId = function(req, res, next) {
    var unit_id = validator.trim(req.params.unit_id);
    var options = {
        conditions: {
            unit: unit_id
        }
    };

    UserModel.findBy(options, function(err, users) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'users': users
        });
    });
};

exports.findBySegmentId = function(req, res, next) {
    var segment_id = validator.trim(req.params.segment_id);
    var options = {
        conditions: {
            section: segment_id
        }
    };

    UserModel.findBy(options, function(err, users) {
        if (err) {
            return next(err);
        }

        if (users.length === 0) {
            options.conditions = {
                branch: segment_id
            };

            UserModel.findBy(options, function(err, users) {
                if (err) {
                    return next(err);
                }

                res.send({
                    'status': 'success',
                    'code': 0,
                    'users': users
                });
            });
        } else {
            res.send({
                'status': 'success',
                'code': 0,
                'users': users
            });
        }
    });
};

exports.auth = function(req, res, next) {
    if (!req.session.user) {
        return next({
            code: 105,
            message: '用户未登录'
        });
    }

    res.send({
        code: 0,
        status: 'success',
        user: req.session.user
    });
};

exports.logout = function(req, res, next) {
    if (!req.session.user) {
        return next({
            code: 0,
            status: 'success',
            message: '用户未登录'
        });
    }

    req.session.user = null;

    res.send({
        code: 0,
        status: 'success',
        message: '退出成功'
    });
};

exports.login = function(req, res, next) {
    var username = validator.trim(req.body.username).toLowerCase();
    var password = validator.trim(req.body.password);

    var ep = new eventproxy();
    ep.on('error', function(msg) {
        res.send({
            code: 105,
            message: msg || '登录失败'
        });
    });

    if (!username || !password) {
        ep.emit('error', '信息不完整');
        return;
    }

    var options = {
        findOne: true,
        conditions: {
            username: username,
            password: password
        }
    };

    UserModel.findBy(options, function(err, user) {
        if (err) {
            ep.emit('error');
            return;
        }

        if (!user) {
            ep.emit('error', '用户名或者密码错误');
            return;
        }

        // 设置session
        req.session.user = user;

        res.send({
            'status': 'success',
            'code': 0,
            'user': user
        });
    });
};

exports.create = function(req, res, next) {
    var user = new UserModel(req.body);
    user.save(function(err, user) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'user': user
        });
    });
};

exports.changePassword = function(req, res, next) {
    var username = validator.trim(req.body.username).toLowerCase();
    var old_password = validator.trim(req.body.old_password);
    var new_password = validator.trim(req.body.new_password);

    var ep = new eventproxy();
    ep.on('error', function(msg) {
        res.send({
            code: 105,
            message: msg || '登录失败'
        });
    });

    if (!username || !old_password || !new_password) {
        ep.emit('error', '信息不完整');
        return;
    }

    var options = {
        findOne: true,
        conditions: {
            username: username,
            password: old_password
        }
    };

    UserModel.findBy(options, function(err, user) {
        if (err) {
            ep.emit('error');
            return;
        }

        if (!user) {
            ep.emit('error', '用户名或者密码错误');
            return;
        }

        user.password = new_password;
        user.save(function(err, user) {
            if (err) {
                return next(err);
            }

            res.send({
                'status': 'success',
                'code': 0,
                'user': user
            });
        });
    });
};
