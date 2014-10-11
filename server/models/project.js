/**
 * @name 项目文档
 * @description 记录项目基本信息，及其涵盖的标段、分部、工区、班组
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({

    name: { type: String }, // 项目名称
    description: { type: String }, // 项目描述
    province: { type: String }, // 省份

    create_at: { type: Date, default: Date.now }, // 创建条目时间
    update_at: { type: Date, default: Date.now }, // 最近更新时间

    // Which Model to use during population.
    units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }], // 对应单位，包括指挥部、建设单位、施工单位、监理单位

    // Which Model to use during population.
    parts: [{ type: Schema.Types.ObjectId, ref: 'Part' }] // 涵盖的项目组成, 可能有的是标段（土建、监理）、分部、工区、班组

});

// define model.
mongoose.model('Project', ProjectSchema);
