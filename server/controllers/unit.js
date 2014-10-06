var validator = require('validator');
var eventproxy = require('eventproxy');
var Unit = require('../proxy/').Unit;

exports.find = function(req, res, next) {
    return Unit.find(function(err, units) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'units': units
        });
    });
}

exports.create = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var desc = validator.trim(req.body.desc);

    Unit.newAndSave(name, desc, function(err) {
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

    console.log("/unit/create => new and save.");
}
