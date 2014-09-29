var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy/').User;

exports.signup = function(req, res, next) {
    var username = validator.trim(req.body.username).toLowerCase();
    var password = validator.trim(req.body.password);
    var name = validator.trim(req.body.name);
    var tel = validator.trim(req.body.tel);
    var mobile = validator.trim(req.body.mobile);
    var email = validator.trim(req.body.email).toLowerCase();
    var avatar_url = validator.trim(req.body.avatar_url).toLowerCase();

    User.newAndSave(username, name, password, email, tel, mobile, avatar_url, true, null, null, null, null, null, null, null, function(err) {
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
