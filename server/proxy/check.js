var _ = require('lodash');
var Check = require('../models/').Check;
var Table = require('../models/').Table;
var Unit = require('../models/').Unit;
var User = require('../models/').User;

exports.find = function (callback) {
    Check.find({}, callback);
};

exports.findById = function (id, callback) {
    Check.findOne({_id: id}).populate('project').populate('section').populate('table').exec(callback);
};

exports.newAndSave = function (project_id, section_id, branch_id, place_id, target, table_id, callback) {
  var check = new Check();

  check.project = project_id || null;
  check.section = section_id || null;
  check.branch = branch_id || null;
  check.place = place_id || null;

  check.target = target;

  check.table = table_id || null;
  check.save(callback);

};
