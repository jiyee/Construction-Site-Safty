/**
 * @name 安全检查
 * @description 通过定位、拍照记录
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-28
 */

var _ = require('lodash');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CaptureSchema = new Schema({
    type: { type: String, default: 'capture' }, // 数据类型

    uuid: { type: String, required: '{PATH}不能为空' }, // 考核编号, 自动生成

    name: { type: String, required: '{PATH}不能为空' }, // 问题名称
    description: { type: String }, // 问题描述

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    user: { type: Schema.Types.ObjectId, ref: 'User' }, // 拍摄人

    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 隶属项目，便于信息展示

    section: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 隶属的项目组成，标段

    branch: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 隶属的项目组成，分部

    responsible_unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 存在问题的建设单位
    responsible_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 存在问题的建设单位责任人

    process_active: { type: Boolean, default: true }, // 流程是否激活
    process_status: { type: String, enum: ['START', 'FORWARD', 'BACKWARD', 'END'] }, // 流程状态
    process_current_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 当前处理人员
    process_previous_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 上级处理人员
    process_flow_users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 层级处理人员，记录正常流程中处理顺序
    process_history_users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 历次处理人员，记录过程中所有处理情况，包括revert情况

    category: { type: String }, // 类别与细项

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
