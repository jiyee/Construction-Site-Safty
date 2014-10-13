var mongoose = require('mongoose');
var settings = require('../settings');

mongoose.connect("mongodb://localhost/" + settings.db, function (err) {
  if (err) {
      console.error('connect to %s error: ', settings.db, err.message);
      process.exit(1);
  } else {
      console.log('connect to %s server.', settings.db);
  }
});

// include models
require('./user');
require('./role');
require('./unit');
require('./project');
require('./segment');
require('./table');
require('./check');

// retrieve models
exports.UserModel = mongoose.model('User');
exports.RoleModel = mongoose.model('Role');
exports.UnitModel = mongoose.model('Unit');
exports.ProjectModel = mongoose.model('Project');
exports.SegmentModel = mongoose.model('Segment');
exports.TableModel = mongoose.model('Table');
exports.CheckModel = mongoose.model('Check');