var _ = require('lodash');
var Part = require('../models/').Part;
var utils = require('../utils');

exports.findAll = function (callback) {
    Part.find({}, callback);
};

exports.findByUnitId = function (unit_id, callback) {
    Part.find({ units: unit_id }, callback);
};

exports.findById = function (id, callback, not_populate) {
    if (not_populate) {
        Part.findOne({_id: id}).exec(callback);
    } else {
        Part.findOne({_id: id}).populate('children').exec(function (err, root) {
            if (err) {
                return next(err);
            }

            if (!root) {
                return next(utils.getError(102));
            }

            var __total = 0;
            var __done = 0;
            var deepPopulate = function (err, part) {
                var parent = part.children;
                if (parent && parent.length > 0) {
                    __total += parent.length;
                    __done += 1;

                    _.each(parent, function (child) {
                        Part.populate(child, {
                            path: 'children'
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
    var part = new Part();

    part.name = name;
    part.description = description;
    part.abbr = abbr;

    part.type = type;
    part.is_leaf = is_leaf || false;

    part.save(callback);
};
