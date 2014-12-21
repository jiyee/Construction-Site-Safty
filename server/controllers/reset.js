var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');

var CaptureModel = require('../models/').CaptureModel;
var CheckModel = require('../models/').CheckModel;
var EvaluationModel = require('../models/').EvaluationModel;
var TableModel = require('../models/').TableModel;

exports.mongo = function(req, res, next) {
    var ep = new eventproxy();

    CheckModel.remove({}, function(err) {
        ep.emit('remove');
    });
    TableModel.remove({}, function(err) {
        ep.emit('remove');
    });
    EvaluationModel.remove({}, function(err) {
        ep.emit('remove');
    });
    CaptureModel.remove({}, function(err) {
        ep.emit('remove');
    });

    next();
};