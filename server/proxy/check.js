var _ = require('lodash');
var Check = require('../models/').Check;
var Table = require('../models/').Table;
var Unit = require('../models/').Unit;
var User = require('../models/').User;

exports.findAll = function (callback) {
    Check.find({}).populate('project segment table').exec(callback);
};

exports.findById = function (id, callback) {
    Check.findOne({_id: id}).populate('project segment table check_user process_current_user process_previous_user process_flow_users process_history_users rectification_user review_user').exec(callback);
};

exports.findByProcessCurrentUserId = function (user_id, callback) {
    Check.find({process_current_user: user_id}).populate('project segment table').exec(callback);
};

/**
 * 创建一次检查，执行初始化操作，检查更新在controller里处理
 * @param  {ObjectId}   project_id
 * @param  {ObjectId}   segment_id
 * @param  {ObjectId}   table_id
 * @param  {String}     target
 * @param  {ObjectId}   check_user_id
 * @param  {Function}   callback
 */
exports.newAndSave = function (project_id, segment_id, table_id, target, check_user_id, callback) {

    var check = new Check();

    check.uuid = Date.now();

    check.project = project_id || null;
    check.segment = segment_id || null;
    check.table = table_id || null;

    check.target = target;
    check.check_user = check_user_id || null;

    // 初始化流程状态
    check.process_active = true;
    check.process_status = 'START';
    check.process_current_user = check_user_id || null;
    check.process_previous_user = null;
    check.process_flow_users = [];
    check.process_history_users = [];

    check.save(callback);

};
