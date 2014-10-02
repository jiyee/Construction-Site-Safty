/**
 * @name 标段文档
 * @description 记录项目标段信息
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new Schema({
    name: { type: String},
    desc: { type: String},

    create_at: { type: Date, default: Date.now},
    update_at: { type: Date, default: Date.now},

    // Which Model to use during population.
    // units: [{ type: Schema.Types.ObjectId, ref: 'Unit'}], // 涵盖的部门
    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 所属项目
    branches: [{ type: Schema.Types.ObjectId, ref: 'Branch'}], // 涵盖的分部
    places: [{ type: Schema.Types.ObjectId, ref: 'Place'}], // 涵盖的工区
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team'}] // 涵盖的班组
});

// define model.
mongoose.model('Section', SectionSchema);