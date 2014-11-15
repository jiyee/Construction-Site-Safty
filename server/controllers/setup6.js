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

    var sequences = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

    function toWords(num) {
        var str = "" + num;
        var buttomNum = 1;
        for (var i = 0; i < str.length - 1; i++) {
            buttomNum *= 10;
        }
        var retStr = "";
        var numCopy = num;
        for (var j = 0; j < str.length; j++) {
            retStr += sequences[((numCopy / buttomNum) >> 0)];
            numCopy = numCopy % buttomNum;
            buttomNum = buttomNum / 10;
        }
        return retStr;
    }

    var projects = require('../data/project.json');
    var sections, constructors, supervisors, builders;
    var m_sections, m_constructors, m_supervisors, m_builders;
    _.each(projects, function(project) {
        sections = [];
        branches = [];
        supervisors = [];
        builders = [];
        m_sections = [];
        m_branches = [];
        m_constructors = [];
        m_supervisors = [];
        m_builders = [];

        var m_project = new ProjectModel();
        m_project.name = project.name;
        m_project.province = project.province;
        m_project.center = project.center;
        m_project.extent = project.extent;
        m_project.zoom = project.zoom;

        sections = project.sections;

        _.each([project.constructor], function(constructor) {
            var unit = UnitModel();
            unit.name = constructor;
            unit.type = '建设单位';
            unit.save(function(err, unit) {
            });

            m_constructors[unit.name] = unit;
            m_project.units.push(unit._id);

            _.each(_.filter(project.users, {"type": "constructor"}), function(_user) {
                var user = UserModel();
                user.name = _user.name;
                user.mobile = user.mobile;
                user.password = '123456';
                user.username = _user.name;
                user.project = m_project._id;
                user.unit = unit._id;
                user.save(function(err, user) {

                });
            });
        });

        _.each(sections, function(section, index) {
            supervisors.push(section.supervisor);
            builders.push(section.builder);
        });

        supervisors = _.uniq(supervisors);
        builders = _.uniq(builders);

        _.each(supervisors, function(supervisor) {
            var unit = UnitModel();
            unit.name = supervisor;
            unit.type = '监理单位';
            unit.save(function(err, unit) {
            });

            m_supervisors[unit.name] = unit;
            m_project.units.push(unit._id);
        });

        _.each(builders, function(builder) {
            var unit = UnitModel();
            unit.name = builder;
            unit.type = '施工单位';
            unit.save(function(err, unit) {
            });

            m_builders[unit.name] = unit;
            m_project.units.push(unit._id);
        });

        var index = 0;
        _.each(sections, function(section) {
            var segment = SegmentModel();
            var branches = [];
            _.each(section.branches, function(branch) {
                var m_branch = new SegmentModel();
                m_branch.name = branch.name;
                m_branch.type = '分部';
                m_branch.project = m_project._id;
                m_branch.units = [m_supervisors[section.supervisor]._id, m_builders[section.builder]._id];
                m_branch.parent = segment._id;
                m_branch.save(function(err) {

                });

                branches.push(m_branch._id);

                _.each(_.filter(branch.users, {"type": "builder"}), function(_user) {
                    var user = UserModel();
                    user.name = _user.name;
                    user.mobile = user.mobile;
                    user.password = '123456';
                    user.username = _user.name;
                    user.project = m_project._id;
                    user.unit = m_builders[section.builder]._id;
                    user.section = segment._id;
                    user.branch = m_branch._id;
                    user.save(function(err, user) {

                    });
                });
            });


            segment.name = (section.name || toWords(index++)) + '标段';
            segment.type = '标段';
            segment.units = [m_supervisors[section.supervisor]._id, m_builders[section.builder]._id];
            segment.segments = branches;
            segment.save(function(err, segment) {
                m_sections[segment.name] = segment;
            });

            m_project.segments.push(segment._id);

            _.each(_.filter(section.users, {"type": "supervisor"}), function(_user) {
                var user = UserModel();
                user.name = _user.name;
                user.mobile = user.mobile;
                user.password = '123456';
                user.username = _user.name;
                user.project = m_project._id;
                user.unit = m_supervisors[section.supervisor]._id;
                user.section = segment._id;
                user.save(function(err, user) {

                });
            });

            _.each(_.filter(section.users, {"type": "builder"}), function(_user) {
                var user = UserModel();
                user.name = _user.name;
                user.mobile = user.mobile;
                user.password = '123456';
                user.username = _user.name;
                user.project = m_project._id;
                user.unit = m_builders[section.builder]._id;
                user.section = segment._id;
                user.save(function(err, user) {

                });
            });

        });

        m_project.save(function(err, project) {
            if (err) {
                console.log(err);
                next(err);
            }

            console.log('save project', project.name);
            ep.emit('project', project);
        });
    });

    ep.after('project', projects.length, function(projects) {
        next();
    });

};
