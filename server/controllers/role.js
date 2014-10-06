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

exports.create = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var desc = validator.trim(req.body.desc);
    var units = validator.trim(req.body.units);

    if (units.length === 0) {
        units = [];
    }

    Role.newAndSave(name, desc, units, function(err) {
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

    console.log("/role/create => new and save.");
}
