var validator = require('validator');
var eventproxy = require('eventproxy');
var Role = require('../proxy/').Role;

exports.find = function(req, res, next) {
    return Role.find(function(err, roles) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'roles': roles
        });
    });
}

exports.add = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var desc = validator.trim(req.body.desc);
    var departments = validator.trim(req.body.departments);

    if (departments.length === 0) {
        departments = [];
    }

    Role.newAndSave(name, desc, departments, function(err) {
        if (err) {
            console.log('error: ', err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'name': name
        });
    });

    console.log("/role/add => new and save.");
}
