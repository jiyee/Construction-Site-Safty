/**
 * @name 项目文档
 * @description 记录项目基本信息，及其涵盖的标段、分部、工区、班组
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({

    name: { type: String, required: '{PATH}不能为空' }, // 项目名称
    description: { type: String }, // 项目描述
    province: { type: String, required: '{PATH}不能为空' }, // 省份

    abbr: { type: String }, // 简称，如YZGS
    center: [{ type: Number }], // 定位坐标X,Y
    extent: [{ type: Number }], // 坐标范围

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    // Which Model to use during population.
    units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }], // 对应单位，包括指挥部、建设单位、施工单位、监理单位

    // Which Model to use during population.
    segments: [{ type: Schema.Types.ObjectId, ref: 'Segment' }] // 涵盖的项目组成, 可能有的是标段（土建、监理）、分部、工区、班组

});

ProjectSchema.statics = {
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

        query.populate('segments units')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

// define model.
mongoose.model('Project', ProjectSchema);
