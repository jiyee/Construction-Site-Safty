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

    create_at: { type: Date, default: Date.now }, // 创建条目时间
    update_at: { type: Date, default: Date.now }, // 最近更新时间

    items: [{ type: Schema.Types.Mixed }] // 检查项目

});

// TableSchema.pre('save', function (next) {
//     if (this.update_at) {
//         this.update_at = Date.now;
//     }

//     next();
// });

mongoose.model('Table', TableSchema);
