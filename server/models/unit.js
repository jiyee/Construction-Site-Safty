/**
 * @name 用户部门文档
 * @description 记录用户部门，部门应该包括指挥部、监理单位、施工单位等
 * @author jiyee.sheng@gmail.com
 * @since 2014-09-29
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UnitSchema = new Schema({
    name: { type: String },
    description: { type: String },
    type: { type: String },

    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }

});

// define model.
mongoose.model('Unit', UnitSchema);
