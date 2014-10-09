/**
 * @name 用户信息文档
 * @description 记录用户基本信息，及其所属组织层级i
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String },
    title: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    tel: { type: String }, // 座机
    mobile: { type: String }, // 手机号码
    avatar_url: { type: String }, // 头像url

    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },

    // Which Model to use during population.
    role: { type: Schema.Types.ObjectId, ref: 'Role' }, // 角色
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 部门
    part: { type: Schema.Types.ObjectId, ref: 'Part' }  // 隶属项目组成，标段、分部、工区、班组，其中之一
});

// define model.
mongoose.model('User', UserSchema);
