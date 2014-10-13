var User = require('../models/').User;

/**
 * 查找所有用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param  {Function} callback 回调函数
 */
exports.find = function (callback) {
    User.find({}).populate('role unit segment').exec(callback);
};

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

    User.findOne({name: name}).populate('role unit segment').exec(callback);
};

/**
 * 根据用户名, 查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param  {String}   username 用户名 
 * @param  {Function} callback 回调函数
 */
exports.findByUserName = function (username, callback) {
    if (username.length === 0) {
        return callback(null, []);
    }

    User.findOne({username: username}).populate('role unit segment').exec(callback);
};

/**
 * 根据用户ID, 查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param  {String}   id       用户ID
 * @param  {Function} callback 回调函数
 */
exports.findById = function (id, callback) {
    User.findOne({_id: id}).populate('role unit segment').exec(callback);
};

/**
 * 根据角色ID, 查找用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户
 * @param  {String}   roleId       角色ID
 * @param  {Function} callback 回调函数
 */
exports.findByRoleId = function (roleId, callback) {
    User.find({role: roleId}).populate('role unit segment').exec(callback);
};

/**
 * 根据部门ID, 查找用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户
 * @param  {String}   unitId  部门ID
 * @param  {Function} callback 回调函数
 */
exports.findByUnitId = function (unitId, callback) {
    User.find({unit: unitId}).populate('role unit segment').exec(callback);
};

/**
 * 根据项目组成ID, 查找用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户
 * @param  {String}   segmentId  项目组成ID
 * @param  {Function} callback 回调函数
 */
exports.findBySegmentId = function (segmentId, callback) {
    User.find({segment: segmentId}).populate('role unit segment').exec(callback);
};

/**
 * 创建新用户
 * @param  {String}   name       
 * @param  {String}   title      
 * @param  {String}   username   
 * @param  {String}   password   
 * @param  {String}   email      
 * @param  {String}   tel        
 * @param  {String}   mobile     
 * @param  {String}   avatar_url 
 * @param  {Boolean}   active     
 * @param  {ObjectId}   role       
 * @param  {ObjectId}   unit       
 * @param  {Function} callback   
 */
exports.newAndSave = function (name, title, username, password, email, tel, mobile, avatar_url, active, roleId, unitId, segmentId, callback) {
    var user = new User();

    user.name = name;
    user.username = username;
    user.password = password;
    user.email = email;
    user.tel = tel;
    user.mobile = mobile;
    user.avatar_url = avatar_url;

    user.active = active || false;

    user.role = roleId || null;
    user.unit = unitId || null;
    user.segment = segmentId || null;

    user.save(callback);
};
