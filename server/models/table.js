/**
 * @name 安全检查表
 * @description 安全检查表单、安全考核评价表单
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-03
 */

var moongooes = require('moongooes'),
    Schema = moongooes.Schema;

var TableSchema = new Schema({

    id: { type: String }, // 表单编号
    name: { type: String }, // 表单名称
    type: { type: String }, // 表单类型
    
    items: [{ type: Schema.Types.Mixed }] // 检查项目

});