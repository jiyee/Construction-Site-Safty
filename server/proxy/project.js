var _ = require('lodash');
var Project = require('../models/').Project;
var Part = require('../models/').Part;

exports.find = function (callback) {
    Project.find({}, callback);
};

exports.findById = function (id, callback, not_populate) {
    if (not_populate) {
        Project.findOne({_id: id}).exec(callback);
    } else {
        Project.findOne({_id: id}).populate('units').populate('parts').exec(function (err, root) {
            if (err) {
                return next(err);
            }

            if (!root) {
                return next({
                    code: 102,
                    message: '对象不存在'
                });
            }

            var __total = 0;
            var __done = 0;
            var deepPopulate = function (err, part) {
                var parent = part.parts;
                if (parent && parent.length > 0) {
                    __total += parent.length;
                    __done += 1;

                    _.each(parent, function (child) {
                        Part.populate(child, {
                            path: 'parts'
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
