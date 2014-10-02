/**
 * @name 用户角色文档
 * @description 记录用户角色，划分行业主管、安全管理、一线人员
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: { type: String},
    desc: { type: String},

    create_at: { type: Date, default: Date.now},
    update_at: { type: Date, default: Date.now},

    // Which Model to use during population.
    units: [{ type: Schema.Types.ObjectId, ref: 'Unit'}], // 涵盖的部门
});

// define model.
mongoose.model('Role', RoleSchema);