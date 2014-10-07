var Unit = require('../models/').Unit;

exports.find = function (callback) {
    Unit.find({}, callback);
};

exports.findById = function (id, callback) {
    Unit.findOne({_id: id}, callback);
};

exports.newAndSave = function (name, description, type, callback) {
    var unit = new Unit();

    unit.name = name;
    unit.description = description;
    unit.type = type;

    unit.save(callback);
};