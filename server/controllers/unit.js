var validator = require('validator');
var eventproxy = require('eventproxy');
var UnitModel = require('../models/').UnitModel;

exports.findAll = function(req, res, next) {
    var options = {};
    UnitModel.findBy(options, function(err, units) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'units': units
        });
    });
};

exports.findById = function (req, res, next) {
    var unit_id = validator.trim(req.params.unit_id);
    var options = {
        findOne: true,
        conditions: {   
            _id: unit_id
        }
    };

    UnitModel.findBy(options, function (err, unit) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'unit': unit
        });
    });
};

exports.create = function(req, res, next) {
    var unit = new UnitModel(req.body);
    unit.save(function(err, unit) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'unit': unit
        });
    });
};
