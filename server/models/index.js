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
require('./section');
require('./branch');
require('./place');
require('./team');

// retrieve models
exports.User = mongoose.model('User');
exports.Role = mongoose.model('Role');
exports.Unit = mongoose.model('Unit');
exports.Project = mongoose.model('Project');
exports.Section = mongoose.model('Section');
exports.Branch = mongoose.model('Branch');
exports.Place = mongoose.model('Place');
exports.Team = mongoose.model('Team');