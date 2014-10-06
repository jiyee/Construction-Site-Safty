/**
 * @name 分部文档
 * @description 记录项目分部信息
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BranchSchema = new Schema({
    name: { type: String},
    desc: { type: String},

    create_at: { type: Date, default: Date.now},
    update_at: { type: Date, default: Date.now},

    // Which Model to use during population.
    // units: [{ type: Schema.Types.ObjectId, ref: 'Unit'}], // 涵盖的部门
    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 项目
    section: { type: Schema.Types.ObjectId, ref: 'Section'}, // 标段
    branch: { type: Schema.Types.ObjectId, ref: 'Branch'}, // 分部
    places: [{ type: Schema.Types.ObjectId, ref: 'Place'}], // 涵盖的工区
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team'}] // 涵盖的班组
});

// define model.
mongoose.model('Branch', BranchSchema);