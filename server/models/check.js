/**
 * @name 安全检查
 * @description 记录日常安全检查相关信息，以及检查内容和结果
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-03
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CheckSchema = new Schema({
    
    project: { type: Schema.Types.ObjectId, ref: 'Project' }, // 检查项目
    section: { type: Schema.Types.ObjectId, ref: 'Section' }, // 检查标段
    branch: { type: Schema.Types.ObjectId, ref: 'Branch' }, // 检查分部
    place: { type: Schema.Types.ObjectId, ref: 'Place' }, // 检查工区
    team: { type: Schema.Types.ObjectId, ref: 'Team' }, // 检查班组, 对应具体责任人, 以上均可能为空

    checker_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 检查人员
    checker_unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 检查单位

    supervisor_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 监理人员
    constructor_unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 建设单位
    supervisor_unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 监理单位
    builder_unit: { type: Schema.Types.ObjectId, ref: 'Unit' }, // 施工单位

    table: { type: Schema.Types.ObjectId, ref: 'Table' }, // 检查表单, 一次检查对应一个表单

    index: { type: String }, // 检查编号, 自动生成
    date: { type: Date, default: Date.now }, // 检查日期, 当前日期
    target: { type: String }, // 检查对象, 手工填写

    result: { type: String }, // 检查结果, 存在隐患, 自动生成
    criterion: { type: String }, // 整改要求, 手工填写

    rectification: { type: String }, // 整改情况
    rectification_user: { type: Schema.Types.ObjectId, ref: 'User' }, // 整改责任人
    review: { type: String }, // 复查意见
    review_user: { type: Schema.Types.ObjectId, ref: 'User' } // 复查人员

});

mongoose.model('Check', CheckSchema);
