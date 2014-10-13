var _ = require('lodash');
var SegmentModel = require('../models/').SegmentModel;
var utils = require('../utils');

exports.findAll = function (callback) {
    SegmentModel.find({}, callback);
};

exports.findByUnitId = function (unit_id, callback) {
    SegmentModel.find({ units: unit_id }, callback);
};

exports.findById = function (id, callback, not_populate) {
    if (not_populate) {
        SegmentModel.findOne({_id: id}).exec(callback);
    } else {
        SegmentModel.findOne({_id: id}).populate('segments').exec(function (err, root) {
            if (err) {
                return next(err);
            }

            if (!root) {
                return next(utils.getError(102));
            }

            var __total = 0;
            var __done = 0;
            var deepPopulate = function (err, parent) {
                if (parent.segments && parent.segments.length > 0) {
                    __total += parent.segments.length;
                    __done += 1;

                    _.each(parent.segments, function (child) {
                        SegmentModel.populate(child, {
                            path: 'segments'
                        }, deepPopulate);
                    });
                } else {
                    __done += 1;

                    if (__done  > __total) {
                        callback(err, root);
                    }
                }
            };

            // 遍历子节点，深度populated
            deepPopulate(err, root); 
        });
    }
};

exports.newAndSave = function (name, description, abbr, type, is_leaf, callback) {
    var segment = new SegmentModel();

    segment.name = name;
    segment.description = description;
    segment.abbr = abbr;

    segment.type = type;
    segment.is_leaf = is_leaf || false;

    segment.save(callback);
};
