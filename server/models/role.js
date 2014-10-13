/**
 * @name 用户角色文档
 * @description 记录用户角色，划分行业主管、安全管理、一线人员
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: { type: String, required: '{PATH}不能为空' },
    desc: { type: String },

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },

    // Which Model to use during population.
    units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }] // 涵盖的部门
});

// RoleSchema.pre('save', function (next) {
    // next();
// });

RoleSchema.statics = {
    findBy: function (options, callback) {
        var conditions = options.conditions || {};
        var findOne = options.findOne || false;
        var query;

        if (findOne) {
            query = this.findOne(conditions);
        } else {
            query = this.find(conditions);
        }

        query.populate('units')
            .sort({createAt: -1})
            .exec(callback);
    }
};

// define model.
mongoose.model('Role', RoleSchema);
