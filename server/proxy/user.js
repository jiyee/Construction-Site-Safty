var User = require('../models/').User;

exports.newAndSave = function (name, title, username, password, email, tel, mobile, avatar_url, active, role, department, project, section, branch, place, team, callback) {
  var user = new User();

  user.name = name;
  user.username = username;
  user.password = password;
  user.email = email;
  user.tel = tel;
  user.mobile = mobile;
  user.avatar_url = avatar_url;

  user.active = active || false;

  user.role = role;
  user.department = department;
  user.project = project;
  user.section = section;
  user.branch = branch;
  user.place = place;
  user.team = team;

  user.save(callback);
};