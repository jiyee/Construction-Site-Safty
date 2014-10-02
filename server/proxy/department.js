var Department = require('../models/').Department;

exports.find = function (callback) {
    Department.find({}, callback);
};

exports.newAndSave = function (name, desc, callback) {
    var department = new Department();

    department.name = name;
    department.desc = desc;

    department.save(callback);
};