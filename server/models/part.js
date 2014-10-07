/**
 * @name 项目组成
 * @description 记录项目涵盖的标段、分部、工区、班组等组成
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-07
 */

var mongoose = require('mongoose');
var constants = require('../constants');
var Schema = mongoose.Schema;

var PartSchema = new Schema({
    name: { type: String }, // 名称，如监利至江陵高速公路
    abbr: { type: String }, // 简称，如JJJL等
    description: { type: String }, // 描述

    type: { type: String, enum: constants.PARTS }, // 类型，如标段（土建、监理）、分部、工区、班组
    is_leaf: { type: Boolean, default: false }, // 是否叶子节点 

    create_at: { type: Date, default: Date.now }, // 创建条目时间
    update_at: { type: Date, default: Date.now }, // 最近更新时间

    // Which Model to use during population.
    units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }], // 对应单位，包括施工单位、监理单位

    // Which Model to use during population.
    parts: [{ type: Schema.Types.ObjectId, ref: 'Part' }] // 涵盖的项目组成, 可能有的是标段（土建、监理）、分部、工区、班组

});

// define model.
mongoose.model('Part', PartSchema);
