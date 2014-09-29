/**
 * @name 工区文档
 * @description 记录项目工区信息
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
    name: { type: String},
    desc: { type: String},

    create_at: { type: Date, default: Date.now},
    update_at: { type: Date, default: Date.now},

    // Which Model to use during population.
    // departments: [{ type: Schema.Types.ObjectId, ref: 'Department'}], // 涵盖的部门
    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 项目
    branch: { type: Schema.Types.ObjectId, ref: 'Branch'}, // 分部
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team'}] // 涵盖的班组
});

// define model.
mongoose.model('Place', PlaceSchema);