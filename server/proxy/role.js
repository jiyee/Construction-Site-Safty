var Role = require('../models/').Role;

exports.find = function (callback) {
    Role.find({}, callback);
};

exports.newAndSave = function (name, desc, departments, callback) {
  var role = new Role();

  role.name = name;
  role.desc = desc;
  role.departments = departments;

  role.save(callback);
};
