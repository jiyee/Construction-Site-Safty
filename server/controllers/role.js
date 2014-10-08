var validator = require('validator');
var eventproxy = require('eventproxy');
var Role = require('../proxy/').Role;

exports.find = function(req, res, next) {
    return Role.find(function(err, roles) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'roles': roles
        });
    });
};

exports.create = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var desc = validator.trim(req.body.desc);
    var units = validator.trim(req.body.units);

    // units数组采用|符号分割
    if (validator.isNull(units)) {
        units = [];
    } else {
        units = units.split('|');
    }

    Role.newAndSave(name, desc, units, function(err, role) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'role': role
        });
    });

    console.log("/role/create => new and save.");
};
