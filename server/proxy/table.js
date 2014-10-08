var _ = require('lodash');
var Table = require('../models/').Table;

exports.find = function (callback) {
    Table.find({}, callback);
};

exports.findById = function (id, callback) {
    Table.findOne({_id: id}, callback);
};

exports.delete = function (id, callback) {
    Table.remove({_id: id}, callback);
};

/**
 * 创建检查表
 * @param  {String}   file     
 * @param  {Function} callback 
 */
exports.newAndSave = function (file, callback) {
  var table = new Table();

  var proto = require('../data/' + file + '.json');

  _.extend(table, proto);

  table.uuid = Date.now(); // TODO 替换更好的随机算法

  table.save(callback);
};
