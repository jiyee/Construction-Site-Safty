var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var CaptureModel = require('../models/').CaptureModel;

exports.findAll = function(req, res, next) {
    var options = {};
    CaptureModel.findBy(options, function(err, captures) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'captures': captures
        });
    });
};

exports.findById = function (req, res, next) {
    var capture_id = validator.trim(req.params.capture_id);
    var options = {
        findOne: true,
        conditions: {
            _id: capture_id
        }
    };

    CaptureModel.findBy(options, function (err, capture) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'capture': capture
        });
    });
};

exports.findByUserId = function (req, res, next) {
    var user_id = validator.trim(req.params.user_id);
    var options = {
        conditions: {
            user: user_id
        }
    };

    CaptureModel.findBy(options, function (err, captures) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'captures': captures
        });
    });
};


exports.create = function(req, res, next) {

    // images数组采用|符号分割
    if (validator.isNull(req.body.images)) {
        req.body.images = [];
    } else {
        req.body.images = req.body.images.split('|');
    }

    var capture = new CaptureModel(req.body);
    capture.save(function(err, capture) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'capture': capture
        });
    });
};
