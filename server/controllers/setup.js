var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var Project = require('../proxy/').Project;
var Part = require('../proxy/').Part;
var Check = require('../proxy/').Check;
var Table = require('../proxy/').Table;
var Role = require('../proxy/').Role;
var Unit = require('../proxy/').Unit;
var User = require('../proxy/').User;

var ProjectModel = require('../models/').Project;
var PartModel = require('../models/').Part;
var CheckModel = require('../models/').Check;
var TableModel = require('../models/').Table;
var RoleModel = require('../models/').Role;
var UnitModel = require('../models/').Unit;
var UserModel = require('../models/').User;

exports.mongo = function (req, res, next) {
    var ep = new eventproxy();

    ProjectModel.remove({}, function (err) {
        ep.emit('r1');
    });
    PartModel.remove({}, function (err) {
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

    var part1 = {
        name: '第1标段',
        type: '标段'
    };
    var part2 = {
        name: '第1分部',
        type: '分部',
        is_leaf: false
    };
    var part3 = {
        name: '第1工区',
        type: '工区',
        is_leaf: false
    };
    var part4 = {
        name: '第1班组',
        type: '班组',
        is_leaf: true
    };
    var part5 = {
        name: '第2班组',
        type: '班组',
        is_leaf: true
    };

    ep.all('unit1', 'unit2', 'unit3', 'unit4', 'unit5', function (u1, u2, u3, u4, u5) {
        Role.newAndSave(role2.name, "", [u1._id, u2._id, u3._id, u4._id, u5._id], function (err, role) {
            console.log("Save Role");
            ep.emit('role', role);
        });

        ep.all('part4', 'part5', function (p4, p5) {
            ep.all('part3', function (p3) {
                ep.all('part2', function (p2) {
                    Part.newAndSave(part1.name, "", "", part1.type, part1.is_leaf, function (err, part) {
                        part.units.push(u2._id);
                        part.units.push(u4._id);

                        part.parts.push(p2._id);
                        part.save();
                        console.log("Save Part1");
                        ep.emit('part1', part);
                    });
                });
                Part.newAndSave(part2.name, "", "", part2.type, part2.is_leaf, function (err, part) {
                    part.units.push(u2._id);
                    part.units.push(u4._id);

                    part.parts.push(p3._id);
                    part.save();
                    console.log("Save Part2");
                    ep.emit('part2', part);
                }); 
            });
            Part.newAndSave(part3.name, "", "", part3.type, part3.is_leaf, function (err, part) {
                part.units.push(u2._id);
                part.units.push(u4._id);

                part.parts.push(p4._id);
                part.parts.push(p5._id);
                part.save();
                console.log("Save Part3");
                ep.emit('part3', part);
            });
        });
        Part.newAndSave(part4.name, "", "", part4.type, part4.is_leaf, function (err, part) {
            part.units.push(u2._id);
            part.units.push(u4._id);
            part.save();
            console.log("Save Part4");
            ep.emit('part4', part);
        });
        Part.newAndSave(part5.name, "", "", part5.type, part5.is_leaf, function (err, part) {
            part.units.push(u2._id);
            part.units.push(u4._id);
            part.save();
            console.log("Save Part5");
            ep.emit('part5', part);
        });
    });

    Unit.newAndSave(unit1.name, "", unit1.type, function (err, unit) { 
        console.log("Save Unit1");
        ep.emit('unit1', unit);
    });
    Unit.newAndSave(unit2.name, "", unit2.type, function (err, unit) { 
        console.log("Save Unit2");
        ep.emit('unit2', unit);
    });
    Unit.newAndSave(unit3.name, "", unit3.type, function (err, unit) { 
        console.log("Save Unit3");
        ep.emit('unit3', unit);
    });
    Unit.newAndSave(unit4.name, "", unit4.type, function (err, unit) { 
        console.log("Save Unit4");
        ep.emit('unit4', unit);
    });
    Unit.newAndSave(unit5.name, "", unit5.type, function (err, unit) { 
        console.log("Save Unit5");
        ep.emit('unit5', unit);
    });

    ep.all('role', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'part1', 'part2', 'part3', 'part4', 'part5', function (r, u1, u2, u3, u4, u5, p1, p2, p3, p4, p5) {
        User.newAndSave('用户1', "", "user1", "password", "email", "tel", "mobile", "avatar_url", true, r._id, u1._id, null, function(err, user) {
            console.log("Save User1");
        });
        User.newAndSave('用户2', "", "user2", "password", "email", "tel", "mobile", "avatar_url", true, r._id, u2._id, p1._id, function(err, user) {
            console.log("Save User2");
        });
        User.newAndSave('用户3', "", "user3", "password", "email", "tel", "mobile", "avatar_url", true, r._id, u4._id, p1._id, function(err, user) {
            console.log("Save User3");
        });
        User.newAndSave('用户4', "", "user4", "password", "email", "tel", "mobile", "avatar_url", true, r._id, u4._id, p2._id, function(err, user) {
            console.log("Save User4");
        });
        User.newAndSave('用户5', "", "user5", "password", "email", "tel", "mobile", "avatar_url", true, r._id, u4._id, p3._id, function(err, user) {
            console.log("Save User5");
        });
        User.newAndSave('用户6', "", "user6", "password", "email", "tel", "mobile", "avatar_url", true, r._id, u4._id, p4._id, function(err, user) {
            console.log("Save User6");
        });
        User.newAndSave('用户7', "", "user7", "password", "email", "tel", "mobile", "avatar_url", true, r._id, u4._id, p5._id, function(err, user) {
            console.log("Save User7");
        });

        Project.newAndSave("监利至江陵高速公路", "", "湖北省", function (err, project) {
            project.units.push(u1._id);
            project.units.push(u2._id);
            project.units.push(u3._id);
            project.units.push(u4._id);
            project.units.push(u5._id);

            project.parts.push(p1._id);

            project.save();

            console.log("Save Project");
        });
    });

    });
    
};