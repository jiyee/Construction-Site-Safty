var _ = require('lodash');
var Check = require('../models/').Check;
var Table = require('../models/').Table;
var Unit = require('../models/').Unit;
var User = require('../models/').User;

exports.find = function (callback) {
    Check.find({}).populate('project').populate('part').populate('table').exec(callback);
};

exports.findById = function (id, callback) {
    Check.findOne({_id: id}).populate('project').populate('part').populate('table').exec(callback);
};

/**
 * 创建一次检查，执行初始化操作，检查更新在controller里处理
 * @param  {ObjectId}   project_id    
 * @param  {ObjectId}   part_id       
 * @param  {ObjectId}   table_id      
 * @param  {String}   check_target  
 * @param  {ObjectId}   check_user_id 
 * @param  {Function} callback      
 */
exports.newAndSave = function (project_id, part_id, table_id, check_target, check_user_id, callback) {
  
    var check = new Check();

    check.uuid = Date.now();

    check.project = project_id || null;
    check.part = part_id || null;
    check.table = table_id || null;

    check.check_target = check_target;
    check.check_user = check_user_id || null;

    check.save(callback);
  
};
