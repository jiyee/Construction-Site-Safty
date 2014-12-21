/**
 * @name 日常巡检
 * @description 记录日常日常巡检相关信息，以及检查内容和结果
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-03
 */

var _ = require('lodash');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CheckSchema = new Schema({
    type: { type: String, default: 'check' }, // 数据类型

    uuid: { type: String, required: '{PATH}不能为空' }, // 检查编号, 自动生成

    project: { type: Schema.Types.ObjectId, ref: 'Project' }, // 检查项目
    section: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 检查标段
    branch: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 检查分部

    // 检查表
    file: { type: String, required: '{PATH}不能为空' }, // 表单文件名
    table: { type: Schema.Types.ObjectId, ref: 'Table' }, // 检查表, 一次检查对应具体表

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    // 检查
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 检查人员单位
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // 检查人员
    date: { type: Date, default: Date.now }, // 检查日期
    object: { type: String }, // 检查对象, 手工填写
    comment: { type: String }, // 检查结果, 存在隐患

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
            date: { type: Date, default: Date.now },
            unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            action: { type: String }
        }]

    }

});

CheckSchema.set('toJSON', {
    virtuals: true
});

// 关联删除表格
CheckSchema.pre('remove', function (next) {
    var TableModel = require('../models').TableModel;

    if (this.table) {
        TableModel.findOneAndRemove({_id: this.table}, function(err) {
            if (err) {
                return next(err);
            }

            next();
        });
    }

    next();
});

// 整改要求从表单里汇总出来
CheckSchema.virtual('requirement').get(function () {
    var requirement = [];
    if (this.table) {
        _.each(this.table.items, function(level1) {
            _.each(level1.items, function(level2) {
                _.each(level2.items, function(level3) {
                    if (level3.status != 'UNCHECK' && level3.score > 0) {
                        level3.full_index = [level1.index, level2.index, level3.index].join('-');
                        requirement.push(level3);
                    }
                });
            });
        });
    }

    return requirement;
});

// 已检查的项目
CheckSchema.virtual('checked_items').get(function () {
    var checked_items = [];
    if (this.table) {
        _.each(this.table.items, function(level1) {
            _.each(level1.items, function(level2) {
                _.each(level2.items, function(level3) {
                    if (level3.status != 'UNCHECK') {
                        level3.full_index = [level1.index, level2.index, level3.index].join('-');
                        checked_items.push(level3);
                    }
                });
            });
        });
    }

    return checked_items;
});

CheckSchema.statics = {
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

        query.populate('project section branch table user unit')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

mongoose.model('Check', CheckSchema);
