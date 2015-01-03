var validator = require('validator');
var eventproxy = require('eventproxy');
var GeoJSON = require('geojson');
var GpsModel = require('../models/').GpsModel;

exports.findAll = function(req, res, next) {
    var options = {};
    GpsModel.findBy(options, function(err, gps) {
        if (err) {
            return next(err);
        }

        res.send(GeoJSON.parse(gps, {Point: ['lat', 'lng'], include: ['name', 'description']}));
    });
};

exports.findById = function (req, res, next) {
    var gps_id = validator.trim(req.params.gps_id);
    var options = {
        findOne: true,
        conditions: {
            _id: gps_id
        }
    };

    GpsModel.findBy(options, function (err, gps) {
        if (err) {
            return next(err);
        }

        res.send(GeoJSON.parse(gps, {Point: ['lat', 'lng'], include: ['name', 'description']}));
    });
};

exports.create = function(req, res, next) {
    var gps = new GpsModel(req.body);
    gps.save(function(err, gps) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0
        });
    });
};
