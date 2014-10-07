var _ = require('lodash');
var Part = require('../models/').Part;

exports.find = function (callback) {
    Part.find({}, callback);
};

exports.findById = function (id, callback, not_populate) {
    if (not_populate) {
        Part.findOne({_id: id}).exec(callback);
    } else {
        Part.findOne({_id: id}).populate('parts').exec(function (err, root) {
            if (err) {
                return next(err);
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

exports.newAndSave = function (name, description, abbr, type, is_leaf, callback) {
    var part = new Part();

    part.name = name;
    part.description = description;
    part.abbr = abbr;

    part.type = type;
    part.is_leaf = is_leaf || false;

    part.save(callback);
};
