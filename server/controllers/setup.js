var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');

var ProjectModel = require('../models/').ProjectModel;
var SegmentModel = require('../models/').SegmentModel;
var CheckModel = require('../models/').CheckModel;
var TableModel = require('../models/').TableModel;
var RoleModel = require('../models/').RoleModel;
var UnitModel = require('../models/').UnitModel;
var UserModel = require('../models/').UserModel;

exports.mongo = function (req, res, next) {
    var ep = new eventproxy();

    ProjectModel.remove({}, function (err) {
        ep.emit('r1');
    });
    SegmentModel.remove({}, function (err) {
        ep.emit('r2');
    });
    CheckModel.remove({}, function (err) {
        ep.emit('r3');
    });
    TableModel.remove({}, function (err) {
        ep.emit('r4');
    });
    RoleModel.remove({}, function (err) {
        ep.emit('r5');
    });
    UnitModel.remove({}, function (err) {
        ep.emit('r6');
    });
    UserModel.remove({}, function (err) {
        ep.emit('r7');
    });

    ep.all('r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', function () {
        
    var unit1 = {
        name: '湖北交投荆潜高速公路建设指挥部',
        type: '建设单位'
    };
    var unit2 = {
        name: '湖北高路公路工程监理咨询有限公司',
        type: '监理单位'
    };
    var unit3 = {
        name: '湖北顺达公路工程咨询监理有限公司',
        type: '监理单位'
    };
    var unit4 = {
        name: '中交路桥建设有限公司',
        type: '施工单位'
    };
    var unit5 = {
        name: '中铁十五局集团第五工程有限公司',
        type: '施工单位'
    };

    var role1 = {
        name: '行业主管'
    };
    var role2 = {
        name: '安全管理'
    };
    var role3 = {
        name: '一线人员'
    };

    var segment1 = {
        name: '第1标段',
        type: '标段'
    };
    var segment2 = {
        name: '第1分部',
        type: '分部',
        is_leaf: false
    };
    var segment3 = {
        name: '第1工区',
        type: '工区',
        is_leaf: false
    };
    var segment4 = {
        name: '第1班组',
        type: '班组',
        is_leaf: true
    };
    var segment5 = {
        name: '第2班组',
        type: '班组',
        is_leaf: true
    };

    var user1 = {
        name: '用户1',
        username: 'user1',
        password: 'pwd1'
    };
    var user2 = {
        name: '用户2',
        username: 'user2',
        password: 'pwd2'
    };
    var user3 = {
        name: '用户3',
        username: 'user3',
        password: 'pwd3'
    };
    var user4 = {
        name: '用户4',
        username: 'user4',
        password: 'pwd4'
    };
    var user5 = {
        name: '用户5',
        username: 'user5',
        password: 'pwd5'
    };
    var user6 = {
        name: '用户6',
        username: 'user6',
        password: 'pwd6'
    };
    var user7 = {
        name: '用户7',
        username: 'user7',
        password: 'pwd7'
    };

    var project1 = {
        name: "监利至江陵高速公路",
        province: "湖北省"
    };

    ep.all('unit1', 'unit2', 'unit3', 'unit4', 'unit5', function (u1, u2, u3, u4, u5) {
        var r2 = new RoleModel();
        r2.name = role2.name;
        r2.units = [u1._id, u2._id, u3._id, u4._id, u5._id];
        r2.save(function(err, role) {
            console.log("Save Role");
            ep.emit('role', role);
        });

        ep.all('segment4', 'segment5', function (p4, p5) {
            ep.all('segment3', function (p3) {
                ep.all('segment2', function (p2) {
                    var p1 = new SegmentModel(segment1);
                    p1.save(function (err, segment) {
                        segment.units.push(u2._id);
                        segment.units.push(u4._id);

                        segment.segments.push(p2._id);
                        segment.save();
                        console.log("Save Segment1");
                        ep.emit('segment1', segment);
                    });
                });
                var p2 = new SegmentModel(segment2);
                p2.save(function (err, segment) {
                    segment.units.push(u2._id);
                    segment.units.push(u4._id);

                    segment.segments.push(p3._id);
                    segment.save();
                    console.log("Save Segment2");
                    ep.emit('segment2', segment);
                }); 
            });
            var p3 = new SegmentModel(segment3);
            p3.save(function (err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u4._id);

                segment.segments.push(p4._id);
                segment.segments.push(p5._id);
                segment.save();
                console.log("Save Segment3");
                ep.emit('segment3', segment);
            });
        });
        var p4 = new SegmentModel(segment4);
        p4.save(function (err, segment) {
            segment.units.push(u2._id);
            segment.units.push(u4._id);
            segment.save();
            console.log("Save Segment4");
            ep.emit('segment4', segment);
        });
        var p5 = new SegmentModel(segment5);
        p5.save(function (err, segment) {
            segment.units.push(u2._id);
            segment.units.push(u4._id);
            segment.save();
            console.log("Save Segment5");
            ep.emit('segment5', segment);
        });
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
    var u5 = new UnitModel(unit5);
    u5.save(function(err, unit) {
        console.log("Save Unit5");
        ep.emit('unit5', unit);
    });

    ep.all('role', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'segment1', 'segment2', 'segment3', 'segment4', 'segment5', function (r, u1, u2, u3, u4, u5, p1, p2, p3, p4, p5) {

        var s1 = new UserModel(user1);
        s1.role = r._id;
        s1.unit = u1._id;
        // s1.segment = p1._id;
        s1.save(function(err, user) {
            console.log("Save user1");
            ep.emit('user1', user);
        });

        var s2 = new UserModel(user2);
        s2.role = r._id;
        s2.unit = u2._id;
        s2.segment = p1._id;
        s2.save(function(err, user) {
            console.log("Save user2");
            ep.emit('user2', user);
        });

        var s3 = new UserModel(user3);
        s3.role = r._id;
        s3.unit = u4._id;
        s3.segment = p1._id;
        s3.save(function(err, user) {
            console.log("Save user3");
            ep.emit('user3', user);
        });

        var s4 = new UserModel(user4);
        s4.role = r._id;
        s4.unit = u4._id;
        s4.segment = p2._id;
        s4.save(function(err, user) {
            console.log("Save user4");
            ep.emit('user4', user);
        });

        var s5 = new UserModel(user5);
        s5.role = r._id;
        s5.unit = u4._id;
        s5.segment = p3._id;
        s5.save(function(err, user) {
            console.log("Save user5");
            ep.emit('user5', user);
        });

        var s6 = new UserModel(user6);
        s6.role = r._id;
        s6.unit = u4._id;
        s6.segment = p4._id;
        s6.save(function(err, user) {
            console.log("Save user6");
            ep.emit('user6', user);
        });

        var s7 = new UserModel(user7);
        s7.role = r._id;
        s7.unit = u4._id;
        s7.segment = p5._id;
        s7.save(function(err, user) {
            console.log("Save user7");
            ep.emit('user7', user);
        });

        var project = new ProjectModel(project1);
        project.save(function (err, project) {
            project.units.push(u1._id);
            project.units.push(u2._id);
            project.units.push(u3._id);
            project.units.push(u4._id);
            project.units.push(u5._id);

            project.segments.push(p1._id);

            project.save();

            console.log("Save Project");
            ep.emit('project1', project);

            p1.project = p2.project = p3.project = p4.project = p5.project = project._id;
            p1.parent = null;
            p2.parent = p1._id;
            p3.parent = p2._id;
            p4.parent = p3._id;
            p5.parent = p3._id;
            p1.save();
            p2.save();
            p3.save();
            p4.save();
            p5.save();
        });

        next({
            code: 0,
            message: "success"
        });
    });

    });
    
};