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

    var user_1_1 = {
        name: '张三',
        username: 'user_4_11',
        password: '123456',
        mobile: '18888888888'
    };
    var user_1_2 = {
        name: '李四',
        username: 'user_4_12',
        password: '123456',
        mobile: '18888888888'
    };


    var ur_1_1 = new UserModel(user_1_1);
    ur_1_1.role = 'worker';
    ur_1_1.save(function(err, user) {
        console.log("Save user_1_1");
        ep.emit('user_1_1', user);
    });

    var ur_1_2 = new UserModel(user_1_2);
    ur_1_2.role = 'worker';
    ur_1_2.save(function(err, user) {
        console.log("Save user_1_2");
        ep.emit('user_1_2', user);
    });

    console.log('setup 4');
    next();
};
