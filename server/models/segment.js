/**
 * @name 项目组成
 * @description 记录项目涵盖的标段、分部、工区、班组等组成
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-07
 */

var mongoose = require('mongoose');
var constants = require('../constants');
var Schema = mongoose.Schema;

var SegmentSchema = new Schema({

    name: { type: String, required: '{PATH}不能为空' }, // 名称，如监利至江陵高速公路
    abbr: { type: String }, // 简称，如JJJL等
    description: { type: String }, // 描述

    type: { type: String, enum: constants.SEGMENT_TYPES, required: '{PATH}不能为空' }, // 类型，如标段（土建、监理）、分部、工区、班组

    is_leaf: { type: Boolean, default: false }, // 是否叶子节点，流程里能够设定是否仍能继续下达

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 隶属项目，便于信息展示

    parent: { type: Schema.Types.ObjectId, ref: 'Segment'}, // 上级项目组成，便于检索

    segments: [{ type: Schema.Types.ObjectId, ref: 'Segment' }], // 涵盖的项目组成, 可能有的是标段、分部、工区、班组，这个包含层级关系

    units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }] // 负责的单位，包括建设单位、施工单位、监理单位，这个没有层级关系

});

SegmentSchema.statics = {
    findBy: function (options, callback) {
        var conditions = options.conditions || {};
        var findOne = options.findOne || false;
        var select = options.select || '';
        var query;

        if (findOne) {
            query = this.findOne(conditions);
        } else {
            query = this.find(conditions);
        }

        if (select) {
            query.select(select);
        }

        query.populate('project parent segments units')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

// define model.
mongoose.model('Segment', SegmentSchema);
