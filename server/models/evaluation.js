/**
 * @name 考核评价
 * @description 记录考核评价的相关信息
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-14
 */

var _ = require('lodash');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EvaluationSchema = new Schema({
    type: { type: String, default: 'evaluation' }, // 数据类型

    uuid: { type: String, required: '{PATH}不能为空' }, // 考核编号, 自动生成

    project: { type: Schema.Types.ObjectId, ref: 'Project', required: '{PATH}不能为空' }, // 考核项目
    section: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 考核项目组成，标段
    branch: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 考核项目组成，分部
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 考核对象单位，考核评价涉及施工单位、监理单位、建设单位

    progress: [{ type: String }], // progress分解阶段

    // 考核评价表
    tables: [{ type: Schema.Types.ObjectId, ref: 'Table' }], // 考核表，一次考核评价直接创建4张表

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    // 考核评价信息
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 考核人员，允许多人同时考核
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // 考核人员
    date: { type: Date, default: Date.now }, // 考核日期
    object: { type: String, default: 'builder' }, // 考核对象类型，builder, supervisor, constructor
    comment: { type: String }, // 存在问题

    // 问题汇总
    archives: [{
        index: { type: String }, // 索引
        name: { type: String, required: '{PATH}不能为空' }, // 检查对象
        comment: { type: String }, // 检查问题
        linked: { type: Boolean, default: false }, // 是否属于关联条目
        images: [{
            uri: { type: String }, // 照片URI
            url: { type: String }, // 照片URL
            date: { type: Date }, // 拍摄日期
            center: [{ type: Number }] // 定位坐标
        }]
    }],

    // 责任建设单位以及责任人
    builder: {
        unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 存在问题的建设单位
        user: { type: Schema.Types.ObjectId, ref: 'User' }, // 存在问题的建设单位责任人
        qrcode: { type: String }, // 责任人确认二维码
    },

    supervisor: {
        unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 存在问题的建设单位
        user: { type: Schema.Types.ObjectId, ref: 'User' }, // 存在问题的建设单位责任人
        qrcode: { type: String }, // 责任人确认二维码
    },

    // 简化流程处理，形成闭环
    // 流程启动comment为整改要求，问题在comment已说明
    // 流程转向comment为整改情况说明
    // 流程最终comment为整改验收
    process: {

        createAt: { type: Date, default: Date.now }, // 创建条目时间
        updateAt: { type: Date, default: Date.now }, // 最近更新时间

        active: { type: Boolean, default: false }, // 流程是否激活
        status: { type: String, enum: ['', 'START', 'STOP', 'FORWARD', 'REVERT', 'RESTORE', 'BACKWARD', 'END'] }, // 流程状态

        current: {
            due: { type: Date },
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        },
        previous: {
            due: { type: Date },
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        },
        sequences: [{
            due: { type: Date },
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        }],
        archives: [{
            due: { type: Date },
            date: { type: Date, default: Date.now },
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String },
            images: [{
                uri: { type: String }, // 照片URI
                url: { type: String }, // 照片URL
                date: { type: Date }, // 拍摄日期
                center: [{ type: Number }] // 定位坐标
            }]
        }]

    }
});

// 关联删除
EvaluationSchema.pre('remove', function (next) {
    var TableModel = require('../models').TableModel;

    if (this.tables) {
        TableModel.find({_id: {$in: this.tables}}, function(err, tables) {
            if (err) {
                return next(err);
            }

            next();
        });
    }

    next();
});

EvaluationSchema.statics = {
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

        query.populate('project section branch tables unit user')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

mongoose.model('Evaluation', EvaluationSchema);
