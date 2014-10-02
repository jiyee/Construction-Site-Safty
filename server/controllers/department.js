var validator = require('validator');
var eventproxy = require('eventproxy');
var Department = require('../proxy/').Department;

exports.find = function(req, res, next) {
    return Department.find(function(err, departments) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'departments': departments
        });
    });
}

exports.create = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var desc = validator.trim(req.body.desc);

    Department.newAndSave(name, desc, function(err) {
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

    console.log("/department/add => new and save.");
}
