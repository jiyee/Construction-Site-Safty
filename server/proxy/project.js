var _ = require('lodash');
var utils = require('../utils');
var Project = require('../models/').Project;
var SegmentModel = require('../models/').SegmentModel;

exports.findAll = function (callback) {
    Project.find({}, callback);
};

exports.findById = function (id, callback, not_populate) {
    if (not_populate) {
        Project.findOne({_id: id}).exec(callback);
    } else {
        Project.findOne({_id: id}).populate('units segments').exec(function (err, root) {
            if (err) {
                return next(err);
            }

            if (!root) {
                return next(util.getError(102));
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

            deepPopulate(err, root); 
        });
    }
};

exports.newAndSave = function (name, desc, province, callback) {
  var project = new Project();

  project.name = name;
  project.desc = desc;
  project.province = province;

  project.save(callback);
};
