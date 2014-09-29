/**
 * @name 用户部门文档
 * @description 记录用户部门，部门应该包括指挥部、监理单位、施工单位等
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
    name: { type: String},
    desc: { type: String},

    create_at: { type: Date, default: Date.now},
    update_at: { type: Date, default: Date.now},

    // Which Model to use during population.
    // departments: [{ type: Schema.Types.ObjectId, ref: 'Department'}], // 涵盖的部门
});

// define model.
mongoose.model('Department', DepartmentSchema);