/**
 * @name 用户部门文档
 * @description 记录用户部门，部门应该包括指挥部、监理单位、施工单位等
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UnitSchema = new Schema({

    name: { type: String, required: '{PATH}不能为空' },
    description: { type: String },
    type: { type: String, required: '{PATH}不能为空' }, // 部门类型，包括指挥部、建设单位、施工单位、监理单位

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }

});

UnitSchema.statics = {
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
                createAt: 1
            })
            .exec(callback);
    }
};

// define model.
mongoose.model('Unit', UnitSchema);
