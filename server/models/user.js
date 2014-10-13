/**
 * @name 用户信息文档
 * @description 记录用户基本信息，及其所属组织层级i
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constants = require('../constants');

var UserSchema = new Schema({
    name: { type: String, required: '{PATH}不能为空'  },
    title: { type: String },
    username: { type: String, required: '{PATH}不能为空' },
    password: { type: String, required: '{PATH}不能为空' },
    email: { type: String },
    tel: { type: String }, // 座机
    mobile: { type: String }, // 手机号码
    avatar_url: { type: String }, // 头像url

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },

    authorities: [{ type: String, enum: constants.AUTHORITY_TYPES }], // 权限范围，相同角色的用户权限也可能不相同

    // Which Model to use during population.
    role: { type: Schema.Types.ObjectId, ref: 'Role' }, // 角色
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 部门
    segment: { type: Schema.Types.ObjectId, ref: 'Segment' }  // 隶属项目组成，标段、分部、工区、班组，其中之一
});

UserSchema.statics = {
    findBy: function (options, callback) {
        var conditions = options.conditions || {};
        var findOne = options.findOne || false;
        var select = options.select || '';
        var query;

        if (findOne) {
            query = this.findOne(conditions);
        } else {
            query = this.find(conditions);
        }

        if (select) {
            query.select(select);
        }

        query.populate('role unit segment')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

// define model.
mongoose.model('User', UserSchema);
