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
    var project1, project2;
    ProjectModel.find({}, function(err, projects) {
        console.log("find projects", projects.length);
        _.each(projects, function(project) {
            console.log(project.name, project._id);
            if (project.name == '宜张高速公路宜都至五峰段') project1 = project;
            if (project.name == '湖北监利至江陵高速公路') project2 = project;
        });

        setTimeout(function() {

        UserModel.find({
            username: /user_1_.*/i
        }, function(err, users) {
            console.log('find users', users.length);
            _.each(users, function(user) {
                user.project = project1;
                user.save();
            });
        });

        UserModel.find({
            username: /user_2_.*/i
        }, function(err, users) {
            console.log('find users', users.length);
            _.each(users, function(user) {
                user.project = project2;
                user.save();
            });
        });

        console.log('setup 5');
        next();
    }, 1000);
    });


};
