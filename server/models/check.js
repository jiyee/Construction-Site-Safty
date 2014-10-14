/**
 * @name 安全检查
 * @description 记录日常安全检查相关信息，以及检查内容和结果
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-03
 */

var _ = require('lodash');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CheckSchema = new Schema({
 
    uuid: { type: String, required: '{PATH}不能为空' }, // 检查编号, 自动生成
    
    project: { type: Schema.Types.ObjectId, ref: 'Project' }, // 检查项目
    segment: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 检查项目组成，可以是任何级别，但只记录最小级别

    // supervision_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 监理人员，在segment里已经包括
    // construction_unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 施工单位，在segment里已经包括

    // 检查表
    file: { type: String, required: '{PATH}不能为空' }, // 表单文件名
    table: { type: Schema.Types.ObjectId, ref: 'Table' }, // 检查表, 一次检查对应具体表

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    // 检查
    check_date: { type: Date, default: Date.now }, // 检查日期
    check_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 检查人员
    check_target: { type: String }, // 检查对象, 手工填写
    check_result: { type: String }, // 检查结果, 存在隐患, 自动生成

    // 处理流程
    process_active: { type: Boolean, default: true }, // 流程是否激活
    process_status: { type: String, enum: ['START', 'FORWARD', 'BACKWARD', 'END'] }, // 流程状态
    process_current_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 当前处理人员
    process_previous_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 上级处理人员
    process_flow_users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 层级处理人员，记录正常流程中处理顺序
    process_history_users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 历次处理人员，记录过程中所有处理情况，包括revert情况

    // 整改
    rectification_criterion: { type: String }, // 整改要求, 手工填写
    rectification_result: { type: String }, // 整改情况
    rectification_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 整改责任人

    // 复查
    review_result: { type: String }, // 复查意见
    review_user: { type: Schema.Types.ObjectId, ref: 'User' } // 复查人员

});

CheckSchema.pre('save', function (next) {
    var TableModel = require('../models').TableModel;

    if (!this.table && this.file) {
        var table = new TableModel();
        var proto = require('../data/' + this.file + '.json');
        _.extend(table, proto);
        var that = this;

        table.uuid = Date.now();
        table.save(function (err, table) {
            if (err) {
                return next(err);
            }

            that.table = table._id;

            next();
        });
    }

    next();
});

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

        query.populate('project segment table check_user process_current_user process_previous_user process_flow_users process_history_users rectification_user review_user')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

mongoose.model('Check', CheckSchema);
