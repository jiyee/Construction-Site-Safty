var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');

var ProjectModel = require('../models/').ProjectModel;
var SegmentModel = require('../models/').SegmentModel;
var CheckModel = require('../models/').CheckModel;
var EvaluationModel = require('../models/').EvaluationModel;
var TableModel = require('../models/').TableModel;
var UnitModel = require('../models/').UnitModel;
var UserModel = require('../models/').UserModel;

exports.mongo = function(req, res, next) {
    var ep = new eventproxy();

        var unit1 = {
            name: '交通运输部',
            type: '交通运输部'
        };
        var unit2 = {
            name: '湖北省交通运输厅',
            type: '地方主管部门'
        };
        var unit3 = {
            name: '交通运输部科学研究院',
            type: '交通运输部'
        };
        var unit4 = {
            name: '湖北省交通运输厅工程质量监督局',
            type: '地方主管部门'
        };

        var user_1_1 = {
            name: '陈萍',
            username: 'user_3_11',
            password: '123456',
            mobile: '18888888888'
        };
        var user_1_2 = {
            name: '黄宏宝',
            username: 'user_3_12',
            password: '123456',
            mobile: '18888888888'
        };

        var user_2_1 = {
            name: '李裕民',
            username: 'user_3_21',
            password: '123456',
            mobile: '18888888888'
        };

        var user_3_1 = {
            name: '申瑞君',
            username: 'user_3_31',
            password: '123456',
            mobile: '18888888888'
        };
        var user_3_2 = {
            name: '王海燕',
            username: 'user_3_32',
            password: '123456',
            mobile: '18888888888'
        };

        var user_4_1 = {
            name: '章征春',
            username: 'user_3_41',
            password: '123456',
            mobile: '18888888888'
        };
        var user_4_2 = {
            name: '卢柯',
            username: 'user_3_42',
            password: '123456',
            mobile: '18888888888'
        };
        var user_4_3 = {
            name: '张德军',
            username: 'user_3_43',
            password: '123456',
            mobile: '18888888888'
        };
        var user_4_4 = {
            name: '黄军生',
            username: 'user_3_44',
            password: '123456',
            mobile: '18888888888'
        };
        var user_4_5 = {
            name: '张波',
            username: 'user_3_45',
            password: '123456',
            mobile: '18888888888'
        };
        var user_4_6 = {
            name: '王华仙',
            username: 'user_3_46',
            password: '123456',
            mobile: '18888888888'
        };
        var user_4_7 = {
            name: '吕瑞善',
            username: 'user_3_47',
            password: '123456',
            mobile: '18888888888'
        };
        var user_4_8 = {
            name: '谢功元',
            username: 'user_3_48',
            password: '123456',
            mobile: '18888888888'
        };

        ep.all('unit1', 'unit2', 'unit3', 'unit4', function(u1, u2, u3, u4) {
            var ur_1_1 = new UserModel(user_1_1);
            ur_1_1.role = 'administrator';
            ur_1_1.unit = u1._id;
            ur_1_1.save(function(err, user) {
                console.log("Save user_1_1");
                ep.emit('user_1_1', user);
            });
            var ur_1_2 = new UserModel(user_1_2);
            ur_1_2.role = 'administrator';
            ur_1_2.unit = u1._id;
            ur_1_2.save(function(err, user) {
                console.log("Save user_1_2");
                ep.emit('user_1_2', user);
            });

            var ur_2_1 = new UserModel(user_2_1);
            ur_2_1.role = 'administrator';
            ur_2_1.unit = u2._id;
            ur_2_1.save(function(err, user) {
                console.log("Save user_2_1");
                ep.emit('user_2_1', user);
            });

            var ur_3_1 = new UserModel(user_3_1);
            ur_3_1.role = 'administrator';
            ur_3_1.unit = u3._id;
            ur_3_1.save(function(err, user) {
                console.log("Save user_3_1");
                ep.emit('user_3_1', user);
            });
            var ur_3_2 = new UserModel(user_3_2);
            ur_3_2.role = 'administrator';
            ur_3_2.unit = u3._id;
            ur_3_2.save(function(err, user) {
                console.log("Save user_3_2");
                ep.emit('user_3_2', user);
            });

            var ur_4_1 = new UserModel(user_4_1);
            ur_4_1.role = 'administrator';
            ur_4_1.unit = u4._id;
            ur_4_1.save(function(err, user) {
                console.log("Save user_4_1");
                ep.emit('user_4_1', user);
            });
            var ur_4_2 = new UserModel(user_4_2);
            ur_4_2.role = 'administrator';
            ur_4_2.unit = u4._id;
            ur_4_2.save(function(err, user) {
                console.log("Save user_4_2");
                ep.emit('user_4_2', user);
            });
            var ur_4_3 = new UserModel(user_4_3);
            ur_4_3.role = 'administrator';
            ur_4_3.unit = u4._id;
            ur_4_3.save(function(err, user) {
                console.log("Save user_4_3");
                ep.emit('user_4_3', user);
            });
            var ur_4_4 = new UserModel(user_4_4);
            ur_4_4.role = 'administrator';
            ur_4_4.unit = u4._id;
            ur_4_4.save(function(err, user) {
                console.log("Save user_4_4");
                ep.emit('user_4_4', user);
            });
            var ur_4_5 = new UserModel(user_4_5);
            ur_4_5.role = 'administrator';
            ur_4_5.unit = u4._id;
            ur_4_5.save(function(err, user) {
                console.log("Save user_4_5");
                ep.emit('user_4_5', user);
            });
            var ur_4_6 = new UserModel(user_4_6);
            ur_4_6.role = 'administrator';
            ur_4_6.unit = u4._id;
            ur_4_6.save(function(err, user) {
                console.log("Save user_4_6");
                ep.emit('user_4_6', user);
            });
            var ur_4_7 = new UserModel(user_4_7);
            ur_4_7.role = 'administrator';
            ur_4_7.unit = u4._id;
            ur_4_7.save(function(err, user) {
                console.log("Save user_4_7");
                ep.emit('user_4_7', user);
            });
            var ur_4_8 = new UserModel(user_4_8);
            ur_4_8.role = 'administrator';
            ur_4_8.unit = u4._id;
            ur_4_8.save(function(err, user) {
                console.log("Save user_4_8");
                ep.emit('user_4_8', user);
            });

            console.log('setup 3');
            next();
        });

        var u1 = new UnitModel(unit1);
        u1.save(function(err, unit) {
            console.log("Save Unit1");
            ep.emit('unit1', unit);
        });
        var u2 = new UnitModel(unit2);
        u2.save(function(err, unit) {
            console.log("Save Unit2");
            ep.emit('unit2', unit);
        });
        var u3 = new UnitModel(unit3);
        u3.save(function(err, unit) {
            console.log("Save Unit3");
            ep.emit('unit3', unit);
        });
        var u4 = new UnitModel(unit4);
        u4.save(function(err, unit) {
            console.log("Save Unit4");
            ep.emit('unit4', unit);
        });
};