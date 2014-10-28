/**
 * @name 监督抽查拍照
 * @description 通过拍照记录
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-28
 */

var _ = require('lodash');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CaptureSchema = new Schema({

    name: { type: String, required: '{PATH}不能为空' }, // 设施名称
    description: { type: String }, // 问题描述

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    user: { type: Schema.Types.ObjectId, ref: 'User' }, // 拍摄人

    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 隶属项目，便于信息展示

    segment: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 隶属的项目组成

    unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 存在问题的建设单位

    status: { type: String, default: 'UNDO' }, // 整改状态

    images: [{ type: String }], // 照片URI

    center: [{ type: Number }] // 定位坐标

});

CaptureSchema.statics = {
    findBy: function (options, callback) {
        var conditions = options.conditions || {};
        var findOne = options.findOne || false;
        var query;

        if (findOne) {
            query = this.findOne(conditions);
        } else {
            query = this.find(conditions);
        }

        query.populate('user project segment unit')
            .sort({createAt: -1})
            .exec(callback);
    }
};

// define model.
mongoose.model('Capture', CaptureSchema);
