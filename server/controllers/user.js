var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy/').User;

exports.find = function (req, res, next) {
    User.find(function (err, users) {
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

exports.findById = function (req, res, next) {
    var user_id = validator.trim(req.params.user_id);

    User.findById(user_id, function (err, user) {
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

exports.findByName = function (req, res, next) {
    var user_name = validator.trim(req.params.user_name);

    User.findByName(user_name, function (err, user) {
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

exports.findByRoleId = function (req, res, next) {
    var role_id = validator.trim(req.params.role_id);

    User.findByRoleId(role_id, function (err, users) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'users': users
        });
    });
};

exports.findByUnitId = function (req, res, next) {
    var unit_id = validator.trim(req.params.unit_id);

    User.findByUnitId(unit_id, function (err, users) {
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

exports.auth = function (req, res, next) {
    res.send(req.session.user);
};

exports.login = function (req, res, next) {
    var username = validator.trim(req.body.username).toLowerCase();   
    var password = validator.trim(req.body.password);

    var ep = new eventproxy();
    ep.on('error', function (msg) {
        res.send({
            code: 105,
            message: msg || '登录失败'
        });
    });

    if (!username || !password) {
        ep.emit('error', '信息不完整');
        return;
    }

    User.findByUserName(username, function (err, user) {
        if (err) {
            ep.emit('error');
            return;
        }

        if (!user) {
            ep.emit('error', '用户不存在');
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
    var name = validator.trim(req.body.name);
    var title = validator.trim(req.body.title);
    var username = validator.trim(req.body.username).toLowerCase();
    var password = validator.trim(req.body.password);
    var email = validator.trim(req.body.email).toLowerCase();
    var tel = validator.trim(req.body.tel);
    var mobile = validator.trim(req.body.mobile);
    var avatar_url = validator.trim(req.body.avatar_url).toLowerCase();

    var role = validator.trim(req.body.role);
    var unit = validator.trim(req.body.unit);

    User.newAndSave(name, title, username, password, email, tel, mobile, avatar_url, true, role, unit, function(err, user) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'user': user
        });
    });

    console.log("/user/create => new and save.");
};
