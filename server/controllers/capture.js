var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var CaptureModel = require('../models/').CaptureModel;
var UserModel = require('../models/').UserModel;
var UnitModel = require('../models/').UnitModel;
var SegmentModel = require('../models/').SegmentModel;

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

exports.findByDate = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var segment_id = validator.trim(req.params.segment_id);
    var start_date = validator.trim(req.params.start_date);
    var end_date = validator.trim(req.params.end_date);

    if (!project_id || !segment_id || !start_date || !end_date) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            project: project_id,
            createAt: {
                $gte: new Date(start_date),
                $lt: new Date(end_date)
            }
        },
        select: 'segment createAt'
    };

    CaptureModel.findBy(options, function (err, captures) {
        if (err) {
            return next(err);
        }

        var ep = new eventproxy();
        var lge_segment_captures = [];

        ep.all('user', 'segment_tree', function () {
            res.send({
                'code': 0,
                'status': 'success',
                'captures': lge_segment_captures
            });
        });

        // TODO 优化成循环模式
        ep.after('segment.parent.parent', captures.length, function () {
            _.each(captures, function (capture) {
                if (capture.segment._id == segment_id) {
                    lge_segment_captures.push(capture);
                }

                var parent = capture.segment.parent;
                while (parent) {
                    if (parent._id == segment_id) {
                        lge_segment_captures.push(capture);
                        break;
                    } else {
                        parent = parent.parent;
                    }
                }
            });

            ep.emit('segment_tree');
        });

        ep.after('segment.parent', captures.length, function () {
            _.each(captures, function (capture) {
                if (!capture.segment.parent) {
                    ep.emit('segment.parent.parent');
                    return;
                }

                SegmentModel.populate(capture.segment.parent, {
                    path: 'parent'
                }, function (err, segment) {
                    ep.emit('segment.parent.parent');
                });
            });
        });

        _.each(captures, function (capture) {
            if (!capture.segment.parent) {
                ep.emit('segment.parent');
                return;
            }

            SegmentModel.populate(capture.segment, {
                path: 'parent'
            }, function (err, segment) {
                ep.emit('segment.parent');
            });

            UnitModel.populate(capture.user, {
                path: 'unit'
            }, function (err, user) {
                ep.emit('user');
            });
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
    capture.uuid = Date.now();
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
