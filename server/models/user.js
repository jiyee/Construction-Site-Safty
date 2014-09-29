/**
 * @name 用户信息文档
 * @description 记录用户基本信息，及其所属组织层级i
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String},
    title: { type: String},
    username: { type: String},
    password: { type: String},
    email: { type: String},
    tel: { type: String}, 
    mobile: { type: String},
    avatar_url: { type: String},

    create_at: { type: Date, default: Date.now},
    update_at: { type: Date, default: Date.now},

    // Which Model to use during population.
    role: { type: Schema.Types.ObjectId, ref: 'Role', null: true}, // 角色引用
    department: { type: Schema.Types.ObjectId, ref: 'Department', null: true}, // 部门
    project: { type: Schema.Types.ObjectId, ref: 'Project', null: true}, // 项目
    section: { type: Schema.Types.ObjectId, ref: 'Section', null: true}, // 标段
    branch: { type: Schema.Types.ObjectId, ref: 'Branch', null: true}, // 分部
    place: { type: Schema.Types.ObjectId, ref: 'Place', null: true}, // 工区
    team: { type: Schema.Types.ObjectId, ref: 'Team', null: true}// 班组
});

// define model.
mongoose.model('User', UserSchema);