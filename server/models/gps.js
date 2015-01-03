/**
 * @name GPS文档
 * @description 记录自定义GPS定位点等
 * @author jiyee.sheng@gmail.com
 * @since 2015-01-01
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GpsSchema = new Schema({

    name: { type: String, required: '{PATH}不能为空' },
    description: { type: String },
    lat: { type: Number },
    lng: { type: Number },

    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }

});

GpsSchema.statics = {
    findBy: function (options, callback) {
        var conditions = options.conditions || {};
        var findOne = options.findOne || false;
        var query;

        if (findOne) {
            query = this.findOne(conditions);
        } else {
            query = this.find(conditions);
        }

        query.sort({
                createAt: -1
            })
            .exec(callback);
    }
};

// define model.
mongoose.model('Gps', GpsSchema);
