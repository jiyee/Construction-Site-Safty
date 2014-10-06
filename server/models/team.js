/**
 * @name 班组文档
 * @description 记录项目班组信息, 组织结构的最底层
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: { type: String},
    desc: { type: String},

    create_at: { type: Date, default: Date.now},
    update_at: { type: Date, default: Date.now},

    // Which Model to use during population.
    // units: [{ type: Schema.Types.ObjectId, ref: 'Unit'}], // 涵盖的部门
    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 项目
    section: { type: Schema.Types.ObjectId, ref: 'Section'}, // 标段
    branch: { type: Schema.Types.ObjectId, ref: 'Branch'}, // 分部
    place: { type: Schema.Types.ObjectId, ref: 'Place'} // 分部
});

// define model.
mongoose.model('Team', TeamSchema);