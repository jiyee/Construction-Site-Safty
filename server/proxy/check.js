var _ = require('lodash');
var Check = require('../models/').Check;
var Table = require('../models/').Table;
var Unit = require('../models/').Unit;
var User = require('../models/').User;

exports.find = function (callback) {
    Check.find({}, callback);
};

exports.findById = function (id, callback) {
    Check.findOne({_id: id}, callback);
};

exports.newAndSave = function (project_id, section_id, branch_id, place_id, target, file, callback) {
  var check = new Check();

  check.project = project_id;
  check.section = section_id;
  check.branch = branch_id;
  check.place = place_id;

  check.target = target;

  Check.newAndSave(file, function (table_id) {
    check.table = table_id;
    check.save(callback);
  });

};
