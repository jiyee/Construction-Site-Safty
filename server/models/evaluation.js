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
    segment: { type: Schema.Types.ObjectId, ref: 'Segment' }, // 考核项目组成，只能是标段或者分部
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 考核单位

    status: { type: String, enum: ['START', 'END'] }, // 考核状态

    wbs: { type: String }, // 分部、分享工程WBS分解阶段

    // 考核评价表
    tables: [{ type: Schema.Types.ObjectId, ref: 'Table' }], // 考核表，一次考核评价直接创建4张表

    createAt: { type: Date, default: Date.now }, // 创建条目时间
    updateAt: { type: Date, default: Date.now }, // 最近更新时间

    // 考核评价信息
    evaluation_date: { type: Date, default: Date.now }, // 考核日期
    evaluation_date_before: { type: Date }, // 上次考核日期
    evaluation_users: [{ type: Schema.Types.ObjectId, ref: 'User' }] // 考核人员，允许多人同时考核

});

EvaluationSchema.pre('save', function (next) {
    next();
});

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

        query.populate('project segment tables unit evaluation_users')
            .sort({
                createAt: -1
            })
            .exec(callback);
    }
};

mongoose.model('Evaluation', EvaluationSchema);
