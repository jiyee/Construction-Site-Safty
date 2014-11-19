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

    user: { type: Schema.Types.ObjectId, ref: 'User' }, // 检查人
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
    }]
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

        query.populate('user project section branch')
            .sort({createAt: -1})
            .exec(callback);
    }
};

// define model.
mongoose.model('Capture', CaptureSchema);
