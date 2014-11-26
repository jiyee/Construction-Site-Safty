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

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 检查人员单位
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // 检查人员
    date: { type: Date, default: Date.now }, // 检查日期
    project: { type: Schema.Types.ObjectId, ref: 'Project'}, // 隶属项目，便于信息展示
    section: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 隶属的项目组成，标段
    branch: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 隶属的项目组成，分部

    // 问题汇总
    archives: [{
        object: { type: String, required: '{PATH}不能为空' }, // 检查对象
        comment: { type: String }, // 检查问题
        category: { type: String }, // 类别与细项
        image: {
            uri: { type: String }, // 照片URI
            url: { type: String }, // 照片URL
            date: { type: Date }, // 拍摄日期
            center: [{ type: Number }] // 定位坐标
        }
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
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        },
        previous: {
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        },
        sequences: [{
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        }],
        archives: [{
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        }]

    }
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

        query.populate('user project section branch user unit')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

// define model.
mongoose.model('Capture', CaptureSchema);
