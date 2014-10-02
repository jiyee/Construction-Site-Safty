var User = require('../models/').User;

/**
 * 查找所有用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param  {Function} callback 回调函数
 */
exports.find = function (callback) {
    User.find({}, callback);
}

/**
 * 根据用户姓名, 查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param  {String}   name     用户姓名
 * @param  {Function} callback 回调函数
 */
exports.findByName = function (name, callback) {
    if (name.length === 0) {
        return callback(null, []);
    }

    User.findOne({name: name}, callback);
}

/**
 * 根据用户ID, 查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param  {String}   id       用户ID
 * @param  {Function} callback 回调函数
 */
exports.findById = function (id, callback) {
    User.findOne({_id: id}, callback);
}

/**
 * 根据角色ID, 查找用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户
 * @param  {String}   roleId       角色ID
 * @param  {Function} callback 回调函数
 */
exports.findByRoleId = function (roleId, callback) {
    User.find({role: roleId}).populate('role').exec(callback);
}

/**
 * 根据部门ID, 查找用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户
 * @param  {String}   unitId  部门ID
 * @param  {Function} callback 回调函数
 */
exports.findByUnitId = function (unitId, callback) {
    User.find({unit: unitId}).populate('unit').exec(callback);
}

exports.newAndSave = function (name, title, username, password, email, tel, mobile, avatar_url, active, role, unit, project, section, branch, place, team, callback) {
  var user = new User();

  user.name = name;
  user.username = username;
  user.password = password;
  user.email = email;
  user.tel = tel;
  user.mobile = mobile;
  user.avatar_url = avatar_url;

  user.active = active || false;

  user.role = role || null;
  user.unit = unit || null;
  user.project = project || null;
  user.section = section || null;
  user.branch = branch || null;
  user.place = place || null;
  user.team = team || null;

  user.save(callback);
};
