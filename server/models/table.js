/**
 * @name 安全检查表
 * @description 安全检查表单、安全考核评价表单
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-03
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TableSchema = new Schema({

    uuid: { type: String }, // 表单索引号
    file: { type: String }, // 表单文件名
    name: { type: String }, // 表单名称
    type: { type: String }, // 表单类型
    
    items: [{ type: Schema.Types.Mixed }] // 检查项目

});

mongoose.model('Table', TableSchema);