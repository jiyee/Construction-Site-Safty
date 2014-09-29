var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy/').User;

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
        })
    })
}

exports.signup = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var title = validator.trim(req.body.title);
    var username = validator.trim(req.body.username).toLowerCase();
    var password = validator.trim(req.body.password);
    var email = validator.trim(req.body.email).toLowerCase();
    var tel = validator.trim(req.body.tel);
    var mobile = validator.trim(req.body.mobile);
    var avatar_url = validator.trim(req.body.avatar_url).toLowerCase();

    var role = validator.trim(req.body.role);

    User.newAndSave(name, title, username, password, email, tel, mobile, avatar_url, true, role, null, null, null, null, null, null, function(err, user) {
        if (err) {
            console.log('error: ', err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'username': username
        });
    });

    console.log("/user/signup => new and save.");
}
