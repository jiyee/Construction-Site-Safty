var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');

var ProjectModel = require('../models/').ProjectModel;
var SegmentModel = require('../models/').SegmentModel;
var CaptureModel = require('../models/').CaptureModel;
var CheckModel = require('../models/').CheckModel;
var EvaluationModel = require('../models/').EvaluationModel;
var TableModel = require('../models/').TableModel;
var UnitModel = require('../models/').UnitModel;
var UserModel = require('../models/').UserModel;

exports.mongo = function(req, res, next) {
    var ep = new eventproxy();

    ProjectModel.remove({}, function(err) {
        ep.emit('remove');
    });
    SegmentModel.remove({}, function(err) {
        ep.emit('remove');
    });
    CheckModel.remove({}, function(err) {
        ep.emit('remove');
    });
    TableModel.remove({}, function(err) {
        ep.emit('remove');
    });
    UnitModel.remove({}, function(err) {
        ep.emit('remove');
    });
    UserModel.remove({}, function(err) {
        ep.emit('remove');
    });
    EvaluationModel.remove({}, function(err) {
        ep.emit('remove');
    });
    CaptureModel.remove({}, function(err) {
        ep.emit('remove');
    });

    ep.after('remove', 8, function() {
        next();
    });

};
