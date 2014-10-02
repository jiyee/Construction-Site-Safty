var Unit = require('../models/').Unit;

exports.find = function (callback) {
    Unit.find({}, callback);
};

exports.newAndSave = function (name, desc, callback) {
    var unit = new Unit();

    unit.name = name;
    unit.desc = desc;

    unit.save(callback);
};