var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');

var ProjectModel = require('../models/').ProjectModel;
var SegmentModel = require('../models/').SegmentModel;
var CaptureModel = require('../models/').CaptureModel;
var CheckModel = require('../models/').CheckModel;
var EvaluationModel = require('../models/').EvaluationModel;
var TableModel = require('../models/').TableModel;
var UnitModel = require('../models/').UnitModel;
var UserModel = require('../models/').UserModel;

exports.mongo = function(req, res, next) {
    var ep = new eventproxy();

    ProjectModel.remove({}, function(err) {
        ep.emit('remove');
    });
    SegmentModel.remove({}, function(err) {
        ep.emit('remove');
    });
    CheckModel.remove({}, function(err) {
        ep.emit('remove');
    });
    TableModel.remove({}, function(err) {
        ep.emit('remove');
    });
    UnitModel.remove({}, function(err) {
        ep.emit('remove');
    });
    UserModel.remove({}, function(err) {
        ep.emit('remove');
    });
    EvaluationModel.remove({}, function(err) {
        ep.emit('remove');
    });
    CaptureModel.remove({}, function(err) {
        ep.emit('remove');
    });

    ep.after('remove', 8, function() {
        console.log('remove all');
        next();
        return;

        var project1 = {
            name: '宜张高速公路宜都至五峰段',
            province: '湖北省',
            abbr: 'YZGS',
            center: [111.40068, 30.39583],
            extent: [111.56067, 30.50430, 111.24344, 30.29702],
            zoom: 12
        };

        var unit1 = {
            name: '湖北交投宜张公路建设指挥部',
            type: '建设单位'
        };
        var unit2 = {
            name: '湖北公路水运工程咨询监理公司',
            type: '监理单位'
        };
        var unit3 = {
            name: '中交二公局',
            type: '施工单位'
        };
        var unit4 = {
            name: '中国葛洲坝集团股份有限公司',
            type: '施工单位'
        };

        var role2 = {
            name: '安全管理'
        };

        var section1 = {
            name: '宜张二标',
            type: '标段',
            is_leaf: false
        };
        var section2 = {
            name: '宜张三标',
            type: '标段',
            is_leaf: false
        };
        var branch1 = {
            name: '项目部',
            type: '分部',
            is_leaf: false
        };
        var branch2 = {
            name: '一分部',
            type: '分部',
            is_leaf: false
        };
        var branch3 = {
            name: '二分部',
            type: '分部',
            is_leaf: false
        };

        var user_1_1 = {
            name: '徐志宏',
            username: 'user_1_11',
            password: '123456',
            mobile: '15171888887'
        };
        var user_1_2 = {
            name: '周军',
            username: 'user_1_12',
            password: '123456',
            mobile: '18601155772'
        };
        var user_1_3 = {
            name: '池工',
            username: 'user_1_13',
            password: '123456',
            mobile: '13633313456'
        };

        var user_2_1 = {
            name: '张雄',
            username: 'user_1_21',
            password: '123456',
            mobile: '15010758013'
        };
        var user_2_2 = {
            name: '王强',
            username: 'user_1_22',
            password: '123456',
            mobile: '15801594438'
        };
        var user_2_3 = {
            name: '边军',
            username: 'user_1_23',
            password: '123456',
            mobile: '15901099195'
        };

        var user_3_1 = {
            name: '王月',
            username: 'user_1_31',
            password: '123456',
            mobile: '13910962871'
        };
        var user_3_2 = {
            name: '王伦吉',
            username: 'user_1_32',
            password: '123456',
            mobile: '13811098725'
        };
        var user_3_3 = {
            name: '李泽荣',
            username: 'user_1_33',
            password: '123456',
            mobile: '15687265514'
        };

        var user_4_1 = {
            name: '潘畅',
            username: 'user_1_41',
            password: '123456',
            mobile: '15076541886'
        };
        var user_4_2 = {
            name: '甘军',
            username: 'user_1_42',
            password: '123456',
            mobile: '18671442733'
        };
        var user_4_3 = {
            name: '王永亮',
            username: 'user_1_43',
            password: '123456',
            mobile: '18371739061'
        };
        var user_4_4 = {
            name: '程甲甲',
            username: 'user_1_44',
            password: '123456',
            mobile: '15176075800'
        };
        var user_4_5 = {
            name: '李爱民',
            username: 'user_1_45',
            password: '123456',
            mobile: '18972552962'
        };
        var user_4_6 = {
            name: '陈厚望',
            username: 'user_1_46',
            password: '123456',
            mobile: '18674204146'
        };

        var user_5_1 = {
            name: '李新波',
            username: 'user_1_51',
            password: '123456',
            mobile: '18671728280'
        };
        var user_5_2 = {
            name: '陈登志',
            username: 'user_1_52',
            password: '123456',
            mobile: '15100500583'
        };
        var user_5_3 = {
            name: '陈为忠',
            username: 'user_1_53',
            password: '123456',
            mobile: '13887933901'
        };
        var user_5_4 = {
            name: '魏悦东',
            username: 'user_1_54',
            password: '123456',
            mobile: '15100506068'
        };
        var user_5_5 = {
            name: '向国涛',
            username: 'user_1_55',
            password: '123456',
            mobile: '18692584666'
        };
        var user_5_6 = {
            name: '金龙',
            username: 'user_1_56',
            password: '123456',
            mobile: '18771773773'
        };
        var user_5_7 = {
            name: '张晓龙',
            username: 'user_1_57',
            password: '123456',
            mobile: '15833469812'
        };
        var user_5_8 = {
            name: '冷浚',
            username: 'user_1_58',
            password: '123456',
            mobile: '15572723789'
        };
        var user_5_9 = {
            name: '乐诚',
            username: 'user_1_59',
            password: '123456',
            mobile: '18672105708'
        };
        var user_5_10 = {
            name: '张辉',
            username: 'user_1_510',
            password: '123456',
            mobile: '15972198186'
        };

        var user_6_1 = {
            name: '张庆亮',
            username: 'user_1_61',
            password: '123456',
            mobile: '15271455207'
        };
        var user_6_2 = {
            name: '彭文志',
            username: 'user_1_62',
            password: '123456',
            mobile: '13872631250'
        };
        var user_6_3 = {
            name: '孔胜',
            username: 'user_1_63',
            password: '123456',
            mobile: '15071739488'
        };
        var user_6_4 = {
            name: '孟培浩',
            username: 'user_1_64',
            password: '123456',
            mobile: '15572723931'
        };
        var user_6_5 = {
            name: '孙朋朋',
            username: 'user_1_65',
            password: '123456',
            mobile: '15271521653'
        };
        var user_6_6 = {
            name: '汪攀',
            username: 'user_1_66',
            password: '123456',
            mobile: '18507202521'
        };
        var user_6_7 = {
            name: '李冲',
            username: 'user_1_67',
            password: '123456',
            mobile: '13627228801'
        };
        var user_6_8 = {
            name: '齐超',
            username: 'user_1_68',
            password: '123456',
            mobile: '15059562524'
        };

        ep.all('unit1', 'unit2', 'unit3', 'unit4', function(u1, u2, u3, u4) {
            var r2 = new RoleModel();
            r2.name = role2.name;
            r2.units = [u1._id, u2._id, u3._id, u4._id];
            r2.save(function(err, role) {
                console.log("Save role2");
                ep.emit('role2', role);
            });

            ep.all('branch1', 'branch2', 'branch3', function(b1, b2, b3) {
                var s1 = new SegmentModel(section1);
                s1.save(function(err, segment) {
                    segment.units.push(u2._id);
                    segment.units.push(u3._id);

                    segment.save();
                    console.log("Save section1");
                    ep.emit('section1', segment);
                });

                var s2 = new SegmentModel(section2);
                s2.save(function(err, segment) {
                    segment.units.push(u2._id);
                    segment.units.push(u4._id);

                    segment.segments.push(b1._id);
                    segment.segments.push(b2._id);
                    segment.segments.push(b3._id);

                    segment.save();
                    console.log("Save section2");
                    ep.emit('section2', segment);
                });
            });

            var b1 = new SegmentModel(branch1);
            b1.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u4._id);
                segment.save();
                console.log("Save branch1");
                ep.emit('branch1', segment);
            });
            var b2 = new SegmentModel(branch2);
            b2.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u4._id);
                segment.save();
                console.log("Save branch2");
                ep.emit('branch2', segment);
            });
            var b3 = new SegmentModel(branch3);
            b3.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u4._id);
                segment.save();
                console.log("Save branch3");
                ep.emit('branch3', segment);
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

        ep.all('role2', 'unit1', 'unit2', 'unit3', 'unit4', 'section1', 'section2', 'branch1', 'branch2', 'branch3', function(r, u1, u2, u3, u4, s1, s2, b1, b2, b3) {

            var ur_1_1 = new UserModel(user_1_1);
            ur_1_1.role = r._id;
            ur_1_1.unit = u1._id;
            // ur_1_1.segment = p1._id;
            ur_1_1.save(function(err, user) {
                console.log("Save user_1_1");
                ep.emit('user_1_1', user);
            });
            var ur_1_2 = new UserModel(user_1_2);
            ur_1_2.role = r._id;
            ur_1_2.unit = u1._id;
            // ur_1_2.segment = p1._id;
            ur_1_2.save(function(err, user) {
                console.log("Save user_1_2");
                ep.emit('user_1_2', user);
            });
            var ur_1_3 = new UserModel(user_1_3);
            ur_1_3.role = r._id;
            ur_1_3.unit = u1._id;
            // ur_1_3.segment = p1._id;
            ur_1_3.save(function(err, user) {
                console.log("Save user_1_3");
                ep.emit('user_1_3', user);
            });

            var ur_2_1 = new UserModel(user_2_1);
            ur_2_1.role = r._id;
            ur_2_1.unit = u2._id;
            // ur_2_1.segment = p1._id;
            ur_2_1.save(function(err, user) {
                console.log("Save user_2_1");
                ep.emit('user_2_1', user);
            });
            var ur_2_2 = new UserModel(user_2_2);
            ur_2_2.role = r._id;
            ur_2_2.unit = u2._id;
            // ur_2_2.segment = p1._id;
            ur_2_2.save(function(err, user) {
                console.log("Save user_2_2");
                ep.emit('user_2_2', user);
            });
            var ur_2_3 = new UserModel(user_2_3);
            ur_2_3.role = r._id;
            ur_2_3.unit = u2._id;
            // ur_2_3.segment = p1._id;
            ur_2_3.save(function(err, user) {
                console.log("Save user_2_3");
                ep.emit('user_2_3', user);
            });

            var ur_3_1 = new UserModel(user_3_1);
            ur_3_1.role = r._id;
            ur_3_1.unit = u3._id;
            ur_3_1.segment = s1._id;
            ur_3_1.save(function(err, user) {
                console.log("Save user_3_1");
                ep.emit('user_3_1', user);
            });
            var ur_3_2 = new UserModel(user_3_2);
            ur_3_2.role = r._id;
            ur_3_2.unit = u3._id;
            ur_3_2.segment = s1._id;
            ur_3_2.save(function(err, user) {
                console.log("Save user_3_2");
                ep.emit('user_3_2', user);
            });
            var ur_3_3 = new UserModel(user_3_3);
            ur_3_3.role = r._id;
            ur_3_3.unit = u3._id;
            ur_3_3.segment = s1._id;
            ur_3_3.save(function(err, user) {
                console.log("Save user_3_3");
                ep.emit('user_3_3', user);
            });

            var ur_4_1 = new UserModel(user_4_1);
            ur_4_1.role = r._id;
            ur_4_1.unit = u4._id;
            ur_4_1.segment = b1._id;
            ur_4_1.save(function(err, user) {
                console.log("Save user_4_1");
                ep.emit('user_4_1', user);
            });
            var ur_4_2 = new UserModel(user_4_2);
            ur_4_2.role = r._id;
            ur_4_2.unit = u4._id;
            ur_4_2.segment = b1._id;
            ur_4_2.save(function(err, user) {
                console.log("Save user_4_2");
                ep.emit('user_4_2', user);
            });
            var ur_4_3 = new UserModel(user_4_3);
            ur_4_3.role = r._id;
            ur_4_3.unit = u4._id;
            ur_4_3.segment = b1._id;
            ur_4_3.save(function(err, user) {
                console.log("Save user_4_3");
                ep.emit('user_4_3', user);
            });
            var ur_4_4 = new UserModel(user_4_4);
            ur_4_4.role = r._id;
            ur_4_4.unit = u4._id;
            ur_4_4.segment = b1._id;
            ur_4_4.save(function(err, user) {
                console.log("Save user_4_4");
                ep.emit('user_4_4', user);
            });
            var ur_4_5 = new UserModel(user_4_5);
            ur_4_5.role = r._id;
            ur_4_5.unit = u4._id;
            ur_4_5.segment = b1._id;
            ur_4_5.save(function(err, user) {
                console.log("Save user_4_5");
                ep.emit('user_4_5', user);
            });
            var ur_4_6 = new UserModel(user_4_6);
            ur_4_6.role = r._id;
            ur_4_6.unit = u4._id;
            ur_4_6.segment = b1._id;
            ur_4_6.save(function(err, user) {
                console.log("Save user_4_6");
                ep.emit('user_4_6', user);
            });

            var ur_5_1 = new UserModel(user_5_1);
            ur_5_1.role = r._id;
            ur_5_1.unit = u4._id;
            ur_5_1.segment = b2._id;
            ur_5_1.save(function(err, user) {
                console.log("Save user_5_1");
                ep.emit('user_5_1', user);
            });
            var ur_5_2 = new UserModel(user_5_2);
            ur_5_2.role = r._id;
            ur_5_2.unit = u4._id;
            ur_5_2.segment = b2._id;
            ur_5_2.save(function(err, user) {
                console.log("Save user_5_2");
                ep.emit('user_5_2', user);
            });
            var ur_5_3 = new UserModel(user_5_3);
            ur_5_3.role = r._id;
            ur_5_3.unit = u4._id;
            ur_5_3.segment = b2._id;
            ur_5_3.save(function(err, user) {
                console.log("Save user_5_3");
                ep.emit('user_5_3', user);
            });
            var ur_5_4 = new UserModel(user_5_4);
            ur_5_4.role = r._id;
            ur_5_4.unit = u4._id;
            ur_5_4.segment = b2._id;
            ur_5_4.save(function(err, user) {
                console.log("Save user_5_4");
                ep.emit('user_5_4', user);
            });
            var ur_5_5 = new UserModel(user_5_5);
            ur_5_5.role = r._id;
            ur_5_5.unit = u4._id;
            ur_5_5.segment = b2._id;
            ur_5_5.save(function(err, user) {
                console.log("Save user_5_5");
                ep.emit('user_5_5', user);
            });
            var ur_5_6 = new UserModel(user_5_6);
            ur_5_6.role = r._id;
            ur_5_6.unit = u4._id;
            ur_5_6.segment = b2._id;
            ur_5_6.save(function(err, user) {
                console.log("Save user_5_6");
                ep.emit('user_5_6', user);
            });
            var ur_5_7 = new UserModel(user_5_7);
            ur_5_7.role = r._id;
            ur_5_7.unit = u4._id;
            ur_5_7.segment = b2._id;
            ur_5_7.save(function(err, user) {
                console.log("Save user_5_7");
                ep.emit('user_5_7', user);
            });
            var ur_5_8 = new UserModel(user_5_8);
            ur_5_8.role = r._id;
            ur_5_8.unit = u4._id;
            ur_5_8.segment = b2._id;
            ur_5_8.save(function(err, user) {
                console.log("Save user_5_8");
                ep.emit('user_5_8', user);
            });
            var ur_5_9 = new UserModel(user_5_9);
            ur_5_9.role = r._id;
            ur_5_9.unit = u4._id;
            ur_5_9.segment = b2._id;
            ur_5_9.save(function(err, user) {
                console.log("Save user_5_9");
                ep.emit('user_5_9', user);
            });
            var ur_5_10 = new UserModel(user_5_10);
            ur_5_10.role = r._id;
            ur_5_10.unit = u4._id;
            ur_5_10.segment = b2._id;
            ur_5_10.save(function(err, user) {
                console.log("Save user_5_10");
                ep.emit('user_5_10', user);
            });

            var ur_6_1 = new UserModel(user_6_1);
            ur_6_1.role = r._id;
            ur_6_1.unit = u4._id;
            ur_6_1.segment = b3._id;
            ur_6_1.save(function(err, user) {
                console.log("Save user_6_1");
                ep.emit('user_6_1', user);
            });
            var ur_6_2 = new UserModel(user_6_2);
            ur_6_2.role = r._id;
            ur_6_2.unit = u4._id;
            ur_6_2.segment = b3._id;
            ur_6_2.save(function(err, user) {
                console.log("Save user_6_2");
                ep.emit('user_6_2', user);
            });
            var ur_6_3 = new UserModel(user_6_3);
            ur_6_3.role = r._id;
            ur_6_3.unit = u4._id;
            ur_6_3.segment = b3._id;
            ur_6_3.save(function(err, user) {
                console.log("Save user_6_3");
                ep.emit('user_6_3', user);
            });
            var ur_6_4 = new UserModel(user_6_4);
            ur_6_4.role = r._id;
            ur_6_4.unit = u4._id;
            ur_6_4.segment = b3._id;
            ur_6_4.save(function(err, user) {
                console.log("Save user_6_4");
                ep.emit('user_6_4', user);
            });
            var ur_6_5 = new UserModel(user_6_5);
            ur_6_5.role = r._id;
            ur_6_5.unit = u4._id;
            ur_6_5.segment = b3._id;
            ur_6_5.save(function(err, user) {
                console.log("Save user_6_5");
                ep.emit('user_6_5', user);
            });
            var ur_6_6 = new UserModel(user_6_6);
            ur_6_6.role = r._id;
            ur_6_6.unit = u4._id;
            ur_6_6.segment = b3._id;
            ur_6_6.save(function(err, user) {
                console.log("Save user_6_6");
                ep.emit('user_6_6', user);
            });
            var ur_6_7 = new UserModel(user_6_7);
            ur_6_7.role = r._id;
            ur_6_7.unit = u4._id;
            ur_6_7.segment = b3._id;
            ur_6_7.save(function(err, user) {
                console.log("Save user_6_7");
                ep.emit('user_6_7', user);
            });
            var ur_6_8 = new UserModel(user_6_8);
            ur_6_8.role = r._id;
            ur_6_8.unit = u4._id;
            ur_6_8.segment = b3._id;
            ur_6_8.save(function(err, user) {
                console.log("Save user_6_8");
                ep.emit('user_6_8', user);
            });

            var project = new ProjectModel(project1);
            project.save(function(err, project) {
                project.units.push(u1._id);
                project.units.push(u2._id);
                project.units.push(u3._id);
                project.units.push(u4._id);

                project.segments.push(s1._id);
                project.segments.push(s2._id);

                project.save();

                console.log("Save Project");
                ep.emit('project1', project);

                s1.project = s2.project = b1.project = b2.project = b3.project = project._id;

                s1.parent = null;
                s2.parent = null;

                b1.parent = s2._id;
                b2.parent = s2._id;
                b3.parent = s2._id;

                s1.save();
                s2.save();
                b1.save();
                b2.save();
                b3.save();

            });

            console.log('setup 1');
            next();
        });

    });

};
