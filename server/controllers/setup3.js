var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');

var ProjectModel = require('../models/').ProjectModel;
var SegmentModel = require('../models/').SegmentModel;
var CheckModel = require('../models/').CheckModel;
var EvaluationModel = require('../models/').EvaluationModel;
var TableModel = require('../models/').TableModel;
var RoleModel = require('../models/').RoleModel;
var UnitModel = require('../models/').UnitModel;
var UserModel = require('../models/').UserModel;

exports.mongo = function(req, res, next) {
    var ep = new eventproxy();

        var role1 = {
            name: '行业主管'
        };
        var unit1 = {
            name: '交通运输部',
            type: '交通运输部'
        };
        var unit2 = {
            name: '湖北省交通运输厅',
            type: '地方主管部门'
        };

        var user_1_1 = {
            name: '陈萍',
            username: 'user_3_11',
            password: '123456',
            mobile: '18888888888'
        };
        var user_1_2 = {
            name: '桂志敬',
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
        var user_2_2 = {
            name: '卢柯',
            username: 'user_3_22',
            password: '123456',
            mobile: '18888888888'
        };
        var user_2_3 = {
            name: '张德军',
            username: 'user_3_23',
            password: '123456',
            mobile: '18888888888'
        };

        ep.all('unit1', 'unit2', function(u1, u2) {
            var r1 = new RoleModel();
            r1.name = role1.name;
            r1.units = [u1._id, u2._id];
            r1.save(function(err, role) {
                console.log("Save role1");
                ep.emit('role1', role);
            });
        });

        ep.all('role1', 'unit1', 'unit2', function(r1, u1, u2) {
            var ur_1_1 = new UserModel(user_1_1);
            ur_1_1.role = r1._id;
            ur_1_1.unit = u1._id;
            ur_1_1.save(function(err, user) {
                console.log("Save user_1_1");
                ep.emit('user_1_1', user);
            });

            var ur_1_2 = new UserModel(user_1_2);
            ur_1_2.role = r1._id;
            ur_1_2.unit = u1._id;
            ur_1_2.save(function(err, user) {
                console.log("Save user_1_2");
                ep.emit('user_1_2', user);
            });


            var ur_2_1 = new UserModel(user_2_1);
            ur_2_1.role = r1._id;
            ur_2_1.unit = u2._id;
            ur_2_1.save(function(err, user) {
                console.log("Save user_2_1");
                ep.emit('user_2_1', user);
            });
            var ur_2_2 = new UserModel(user_2_2);
            ur_2_2.role = r1._id;
            ur_2_2.unit = u2._id;
            ur_2_2.save(function(err, user) {
                console.log("Save user_2_2");
                ep.emit('user_2_2', user);
            });
            var ur_2_3 = new UserModel(user_2_3);
            ur_2_3.role = r1._id;
            ur_2_3.unit = u2._id;
            ur_2_3.save(function(err, user) {
                console.log("Save user_2_3");
                ep.emit('user_2_3', user);
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
};