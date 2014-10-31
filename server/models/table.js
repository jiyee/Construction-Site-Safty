/**
 * @name 检查表
 * @description 安全日常巡检、考核评价表单
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-03
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TableSchema = new Schema({

    uuid: { type: String, required: '{PATH}不能为空' }, // 表单索引号
    file: { type: String, required: '{PATH}不能为空' }, // 表单文件名
    name: { type: String, required: '{PATH}不能为空' }, // 表单名称
    type: { type: String }, // 表单类型

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    items: [{ type: Schema.Types.Mixed }] // 检查项目

});

TableSchema.statics = {
    findBy: function (options, callback) {
        var conditions = options.conditions || {};
        var findOne = options.findOne || false;
        var query;

        if (findOne) {
            query = this.findOne(conditions);
        } else {
            query = this.find(conditions);
        }

        query.sort({
                createAt: -1
            })
            .exec(callback);
    }
};

mongoose.model('Table', TableSchema);
