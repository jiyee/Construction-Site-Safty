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
    RoleModel.remove({}, function(err) {
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

    ep.after('remove', 8, function() {
        var project1 = {
            name: '湖北监利至江陵高速公路',
            province: '湖北省',
            abbr: 'JBGS',
            center: [111.40068, 30.39583],
            extent: [111.56067, 30.50430, 111.24344, 30.29702],
            zoom: 12
        };

        var unit1 = {
            name: '湖北交投荆潜高速公路建设指挥部',
            type: '建设单位'
        };
        var unit2 = {
            name: '湖北高路公路工程监理咨询有限公司',
            type: '监理单位',
            price: 2969.7287
        };
        var unit3 = {
            name: '湖北顺达公路工程咨询监理有限公司',
            type: '监理单位',
            price: 2332.3511
        };
        var unit4 = {
            name: '中铁二局',
            type: '施工单位'
        };
        var unit5 = {
            name: '中交一局',
            type: '施工单位'
        };
        var unit6 = {
            name: '中铁二十局',
            type: '施工单位'
        };
        var unit7 = {
            name: '中铁十四局',
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

        var section1 = {
            name: '一标',
            type: '标段',
            price: 5801,
            is_leaf: false
        };
        var section2 = {
            name: '二标',
            type: '标段',
            price: 13088,
            is_leaf: false
        };
        var section3 = {
            name: '三标',
            type: '标段',
            price: 80747.6,
            is_leaf: false
        };
        var section4 = {
            name: '四标',
            type: '标段',
            price: 93576.068,
            is_leaf: false
        };

        var branch11 = {
            name: '项目部',
            type: '分部',
            price: 5801,
            is_leaf: false
        };
        var branch12 = {
            name: '一分部',
            type: '分部',
            price: 3456,
            is_leaf: false
        };
        var branch13 = {
            name: '二分部',
            type: '分部',
            price: 3456,
            is_leaf: false
        };

        var branch21 = {
            name: '项目部',
            type: '分部',
            price: 13088,
            is_leaf: false
        };
        var branch22 = {
            name: '一分部',
            type: '分部',
            price: 7088,
            is_leaf: false
        };
        var branch23 = {
            name: '二分部',
            type: '分部',
            price: 6000,
            is_leaf: false
        };

        var user_1_1 = {
            name: '王永红',
            username: 'user11',
            password: '123456',
            mobile: '13789112223'
        };
        var user_1_2 = {
            name: '王金甲',
            username: 'user12',
            password: '123456',
            mobile: '13789112223'
        };
        var user_1_3 = {
            name: '曾建军',
            username: 'user13',
            password: '123456',
            mobile: '13789112223'
        };

        var user_2_1 = {
            name: '龙海生',
            username: 'user21',
            password: '123456',
            mobile: '13997892861'
        };
        var user_2_2 = {
            name: '宋敏',
            username: 'user22',
            password: '123456',
            mobile: '18627278747'
        };
        var user_2_3 = {
            name: '夏道君',
            username: 'user23',
            password: '123456',
            mobile: '13451239950'
        };
        var user_2_4 = {
            name: '时坚',
            username: 'user24',
            password: '123456',
            mobile: '13886990903'
        };
        var user_2_5 = {
            name: '魏伟华',
            username: 'user25',
            password: '123456',
            mobile: '18986050168'
        };

        var user_3_1 = {
            name: '刘勇',
            username: 'user31',
            password: '123456',
            mobile: '13607118311'
        };
        var user_3_2 = {
            name: '代柯',
            username: 'user32',
            password: '123456',
            mobile: '18672861619'
        };
        var user_3_3 = {
            name: '戴愈赟',
            username: 'user33',
            password: '123456',
            mobile: '15871549928'
        };
        var user_3_4 = {
            name: '陈耀华',
            username: 'user34',
            password: '123456',
            mobile: '15171920768'
        };
        var user_3_5 = {
            name: '万志伟',
            username: 'user35',
            password: '123456',
            mobile: '18972879596'
        };

        var user_4_1 = {
            name: '赵东辉',
            username: 'user41',
            password: '123456',
            mobile: '13992001906'
        };
        var user_4_2 = {
            name: '王茗',
            username: 'user42',
            password: '123456',
            mobile: '18571360367'
        };
        var user_4_3 = {
            name: '赵宏',
            username: 'user43',
            password: '123456',
            mobile: '18571360093'
        };

        var user_5_1 = {
            name: '陈培华',
            username: 'user51',
            password: '123456',
            mobile: '18937997997'
        };
        var user_5_2 = {
            name: '罗红军',
            username: 'user52',
            password: '123456',
            mobile: '18571360051'
        };
        var user_5_3 = {
            name: '王岩',
            username: 'user53',
            password: '123456',
            mobile: '18671610227'
        };
        var user_5_4 = {
            name: '孙永超',
            username: 'user54',
            password: '123456',
            mobile: '18637902701'
        };
        var user_5_5 = {
            name: '程浩',
            username: 'user55',
            password: '123456',
            mobile: '13774002359'
        };
        var user_5_6 = {
            name: '吴刚',
            username: 'user56',
            password: '123456',
            mobile: '18571360031'
        };
        var user_5_7 = {
            name: '冯文能',
            username: 'user57',
            password: '123456',
            mobile: '18608684726'
        };

        var user_6_1 = {
            name: '王永广',
            username: 'user61',
            password: '123456',
            mobile: '15236279218'
        };
        var user_6_2 = {
            name: '张宗武',
            username: 'user62',
            password: '123456',
            mobile: '13649265333'
        };
        var user_6_3 = {
            name: '苏正义',
            username: 'user63',
            password: '123456',
            mobile: '15629824666'
        };
        var user_6_4 = {
            name: '王博',
            username: 'user64',
            password: '123456',
            mobile: '18571360083'
        };
        var user_6_5 = {
            name: '南平顺',
            username: 'user65',
            password: '123456',
            mobile: '18571360096'
        };
        var user_6_6 = {
            name: '吴长盛',
            username: 'user66',
            password: '123456',
            mobile: '15608617111'
        };
        var user_6_7 = {
            name: '王辉',
            username: 'user67',
            password: '123456',
            mobile: '18571360093'
        };
        var user_6_8 = {
            name: '何要总',
            username: 'user68',
            password: '123456',
            mobile: '13183050110'
        };

        var user_7_1 = {
            name: '田雪健',
            username: 'user71',
            password: '123456',
            mobile: '18766656234'
        };
        var user_7_2 = {
            name: '瑜伽同',
            username: 'user72',
            password: '123456',
            mobile: '15166687981'
        };
        var user_7_3 = {
            name: '乔晓琳',
            username: 'user73',
            password: '123456',
            mobile: '13877656112'
        };

        var user_8_1 = {
            name: '刘少敏',
            username: 'user81',
            password: '123456',
            mobile: '18774453998'
        };
        var user_8_2 = {
            name: '李泽辉',
            username: 'user82',
            password: '123456',
            mobile: '15511703339'
        };
        var user_8_3 = {
            name: '曲云龙',
            username: 'user83',
            password: '123456',
            mobile: '18773881055'
        };

        var user_9_1 = {
            name: '苏艳林',
            username: 'user91',
            password: '123456',
            mobile: '18772577305'
        };
        var user_9_2 = {
            name: '宿志强',
            username: 'user92',
            password: '123456',
            mobile: '18641256529'
        };
        var user_9_3 = {
            name: '谭正朝',
            username: 'user93',
            password: '123456',
            mobile: '15866030505'
        };
        var user_9_4 = {
            name: '唐刚',
            username: 'user94',
            password: '123456',
            mobile: '13541745431'
        };

        var user_10_1 = {
            name: '李天明',
            username: 'user101',
            password: '123456',
            mobile: '15272569699'
        };
        var user_10_2 = {
            name: '魏阳',
            username: 'user102',
            password: '123456',
            mobile: '18660727617'
        };
        var user_10_3 = {
            name: '郭晋',
            username: 'user103',
            password: '123456',
            mobile: '15272569556'
        };
        var user_10_4 = {
            name: '雷云晖',
            username: 'user104',
            password: '123456',
            mobile: '15272569606'
        };
        var user_10_5 = {
            name: '王安军',
            username: 'user105',
            password: '123456',
            mobile: '15272569616'
        };
        var user_10_6 = {
            name: '马富强',
            username: 'user106',
            password: '123456',
            mobile: '15272569522'
        };
        var user_10_7 = {
            name: '曹义',
            username: 'user107',
            password: '123456',
            mobile: '15272569688'
        };
        var user_10_8 = {
            name: '许伟',
            username: 'user108',
            password: '123456',
            mobile: '15272569600'
        };
        var user_10_9 = {
            name: '盛琦',
            username: 'user109',
            password: '123456',
            mobile: '15272569533'
        };

        var user_11_1 = {
            name: '徐计新',
            username: 'user111',
            password: '123456',
            mobile: '18986669777'
        };
        var user_11_2 = {
            name: '马超',
            username: 'user112',
            password: '123456',
            mobile: '18162381039'
        };
        var user_11_3 = {
            name: '石秀军',
            username: 'user113',
            password: '123456',
            mobile: '18186563388'
        };
        var user_11_4 = {
            name: '董旭',
            username: 'user114',
            password: '123456',
            mobile: '18162381049'
        };
        var user_11_5 = {
            name: '纪信军',
            username: 'user115',
            password: '123456',
            mobile: '18972130999'
        };
        var user_11_6 = {
            name: '王晓杰',
            username: 'user116',
            password: '123456',
            mobile: '18162381036'
        };
        var user_11_7 = {
            name: '王开明',
            username: 'user117',
            password: '123456',
            mobile: '18162388798'
        };
        var user_11_8 = {
            name: '张恒',
            username: 'user118',
            password: '123456',
            mobile: '18162381019'
        };
        var user_11_9 = {
            name: '赵巨斌',
            username: 'user119',
            password: '123456',
            mobile: '18162381085'
        };

        ep.all('unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6', 'unit7', function(u1, u2, u3, u4, u5, u6, u7) {
            var r2 = new RoleModel();
            r2.name = role2.name;
            r2.units = [u1._id, u2._id, u3._id, u4._id, u5._id, u6._id, u7._id];
            r2.save(function(err, role) {
                console.log("Save role2");
                ep.emit('role2', role);
            });

            ep.all('branch11', 'branch12', 'branch13', function(b11, b12, b13) {
                var s1 = new SegmentModel(section1);
                s1.save(function(err, segment) {
                    segment.units.push(u2._id);
                    segment.units.push(u4._id);

                    segment.segments.push(b11._id);
                    segment.segments.push(b12._id);
                    segment.segments.push(b13._id);

                    segment.save();
                    console.log("Save section1");
                    ep.emit('section1', segment);
                });
            });

            ep.all('branch21', 'branch22', 'branch23', function(b21, b22, b23) {
                var s2 = new SegmentModel(section2);
                s2.save(function(err, segment) {
                    segment.units.push(u2._id);
                    segment.units.push(u5._id);

                    segment.segments.push(b21._id);
                    segment.segments.push(b22._id);
                    segment.segments.push(b23._id);

                    segment.save();
                    console.log("Save section2");
                    ep.emit('section2', segment);
                });
            });

            var s3 = new SegmentModel(section3);
            s3.save(function(err, segment) {
                segment.units.push(u3._id);
                segment.units.push(u6._id);

                segment.save();
                console.log("Save section3");
                ep.emit('section3', segment);
            });

            var s4 = new SegmentModel(section4);
            s4.save(function(err, segment) {
                segment.units.push(u3._id);
                segment.units.push(u7._id);

                segment.save();
                console.log("Save section4");
                ep.emit('section4', segment);
            });

            var b11 = new SegmentModel(branch11);
            b11.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u4._id);
                segment.save();
                console.log("Save branch11");
                ep.emit('branch11', segment);
            });
            var b12 = new SegmentModel(branch12);
            b12.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u4._id);
                segment.save();
                console.log("Save branch12");
                ep.emit('branch12', segment);
            });
            var b13 = new SegmentModel(branch13);
            b13.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u4._id);
                segment.save();
                console.log("Save branch13");
                ep.emit('branch13', segment);
            });

            var b21 = new SegmentModel(branch21);
            b21.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u5._id);
                segment.save();
                console.log("Save branch21");
                ep.emit('branch21', segment);
            });
            var b22 = new SegmentModel(branch22);
            b22.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u5._id);
                segment.save();
                console.log("Save branch22");
                ep.emit('branch22', segment);
            });
            var b23 = new SegmentModel(branch23);
            b23.save(function(err, segment) {
                segment.units.push(u2._id);
                segment.units.push(u5._id);
                segment.save();
                console.log("Save branch23");
                ep.emit('branch23', segment);
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
        var u6 = new UnitModel(unit6);
        u6.save(function(err, unit) {
            console.log("Save Unit6");
            ep.emit('unit6', unit);
        });
        var u7 = new UnitModel(unit7);
        u7.save(function(err, unit) {
            console.log("Save Unit7");
            ep.emit('unit7', unit);
        });

        ep.all('role2', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6', 'unit7', 'section1', 'section2', 'section3', 'section4', 'branch11', 'branch12', 'branch13', 'branch21', 'branch22', 'branch23', function(r, u1, u2, u3, u4, u5, u6, u7, s1, s2, s3, s4, b11, b12, b13, b21, b22, b23) {

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
            var ur_2_4 = new UserModel(user_2_4);
            ur_2_4.role = r._id;
            ur_2_4.unit = u2._id;
            // ur_2_4.segment = p1._id;
            ur_2_4.save(function(err, user) {
                console.log("Save user_2_4");
                ep.emit('user_2_4', user);
            });
            var ur_2_5 = new UserModel(user_2_5);
            ur_2_5.role = r._id;
            ur_2_5.unit = u2._id;
            // ur_2_5.segment = p1._id;
            ur_2_5.save(function(err, user) {
                console.log("Save user_2_5");
                ep.emit('user_2_5', user);
            });

            var ur_3_1 = new UserModel(user_3_1);
            ur_3_1.role = r._id;
            ur_3_1.unit = u3._id;
            // ur_3_1.segment = p1._id;
            ur_3_1.save(function(err, user) {
                console.log("Save user_3_1");
                ep.emit('user_3_1', user);
            });
            var ur_3_2 = new UserModel(user_3_2);
            ur_3_2.role = r._id;
            ur_3_2.unit = u3._id;
            // ur_3_2.segment = p1._id;
            ur_3_2.save(function(err, user) {
                console.log("Save user_3_2");
                ep.emit('user_3_2', user);
            });
            var ur_3_3 = new UserModel(user_3_3);
            ur_3_3.role = r._id;
            ur_3_3.unit = u3._id;
            // ur_3_3.segment = p1._id;
            ur_3_3.save(function(err, user) {
                console.log("Save user_3_3");
                ep.emit('user_3_3', user);
            });
            var ur_3_4 = new UserModel(user_3_4);
            ur_3_4.role = r._id;
            ur_3_4.unit = u3._id;
            // ur_3_4.segment = p1._id;
            ur_3_4.save(function(err, user) {
                console.log("Save user_3_4");
                ep.emit('user_3_4', user);
            });
            var ur_3_5 = new UserModel(user_3_5);
            ur_3_5.role = r._id;
            ur_3_5.unit = u3._id;
            // ur_3_5.segment = p1._id;
            ur_3_5.save(function(err, user) {
                console.log("Save user_3_5");
                ep.emit('user_3_5', user);
            });


            var ur_4_1 = new UserModel(user_4_1);
            ur_4_1.role = r._id;
            ur_4_1.unit = u4._id;
            ur_4_1.segment = b11._id;
            ur_4_1.save(function(err, user) {
                console.log("Save user_4_1");
                ep.emit('user_4_1', user);
            });
            var ur_4_2 = new UserModel(user_4_2);
            ur_4_2.role = r._id;
            ur_4_2.unit = u4._id;
            ur_4_2.segment = b11._id;
            ur_4_2.save(function(err, user) {
                console.log("Save user_4_2");
                ep.emit('user_4_2', user);
            });
            var ur_4_3 = new UserModel(user_4_3);
            ur_4_3.role = r._id;
            ur_4_3.unit = u4._id;
            ur_4_3.segment = b11._id;
            ur_4_3.save(function(err, user) {
                console.log("Save user_4_3");
                ep.emit('user_4_3', user);
            });



            var ur_5_1 = new UserModel(user_5_1);
            ur_5_1.role = r._id;
            ur_5_1.unit = u4._id;
            ur_5_1.segment = b12._id;
            ur_5_1.save(function(err, user) {
                console.log("Save user_5_1");
                ep.emit('user_5_1', user);
            });
            var ur_5_2 = new UserModel(user_5_2);
            ur_5_2.role = r._id;
            ur_5_2.unit = u4._id;
            ur_5_2.segment = b12._id;
            ur_5_2.save(function(err, user) {
                console.log("Save user_5_2");
                ep.emit('user_5_2', user);
            });
            var ur_5_3 = new UserModel(user_5_3);
            ur_5_3.role = r._id;
            ur_5_3.unit = u4._id;
            ur_5_3.segment = b12._id;
            ur_5_3.save(function(err, user) {
                console.log("Save user_5_3");
                ep.emit('user_5_3', user);
            });
            var ur_5_4 = new UserModel(user_5_4);
            ur_5_4.role = r._id;
            ur_5_4.unit = u4._id;
            ur_5_4.segment = b12._id;
            ur_5_4.save(function(err, user) {
                console.log("Save user_5_4");
                ep.emit('user_5_4', user);
            });
            var ur_5_5 = new UserModel(user_5_5);
            ur_5_5.role = r._id;
            ur_5_5.unit = u4._id;
            ur_5_5.segment = b12._id;
            ur_5_5.save(function(err, user) {
                console.log("Save user_5_5");
                ep.emit('user_5_5', user);
            });
            var ur_5_6 = new UserModel(user_5_6);
            ur_5_6.role = r._id;
            ur_5_6.unit = u4._id;
            ur_5_6.segment = b12._id;
            ur_5_6.save(function(err, user) {
                console.log("Save user_5_6");
                ep.emit('user_5_6', user);
            });
            var ur_5_7 = new UserModel(user_5_7);
            ur_5_7.role = r._id;
            ur_5_7.unit = u4._id;
            ur_5_7.segment = b12._id;
            ur_5_7.save(function(err, user) {
                console.log("Save user_5_7");
                ep.emit('user_5_7', user);
            });



            var ur_6_1 = new UserModel(user_6_1);
            ur_6_1.role = r._id;
            ur_6_1.unit = u4._id;
            ur_6_1.segment = b13._id;
            ur_6_1.save(function(err, user) {
                console.log("Save user_6_1");
                ep.emit('user_6_1', user);
            });
            var ur_6_2 = new UserModel(user_6_2);
            ur_6_2.role = r._id;
            ur_6_2.unit = u4._id;
            ur_6_2.segment = b13._id;
            ur_6_2.save(function(err, user) {
                console.log("Save user_6_2");
                ep.emit('user_6_2', user);
            });
            var ur_6_3 = new UserModel(user_6_3);
            ur_6_3.role = r._id;
            ur_6_3.unit = u4._id;
            ur_6_3.segment = b13._id;
            ur_6_3.save(function(err, user) {
                console.log("Save user_6_3");
                ep.emit('user_6_3', user);
            });
            var ur_6_4 = new UserModel(user_6_4);
            ur_6_4.role = r._id;
            ur_6_4.unit = u4._id;
            ur_6_4.segment = b13._id;
            ur_6_4.save(function(err, user) {
                console.log("Save user_6_4");
                ep.emit('user_6_4', user);
            });
            var ur_6_5 = new UserModel(user_6_5);
            ur_6_5.role = r._id;
            ur_6_5.unit = u4._id;
            ur_6_5.segment = b13._id;
            ur_6_5.save(function(err, user) {
                console.log("Save user_6_5");
                ep.emit('user_6_5', user);
            });
            var ur_6_6 = new UserModel(user_6_6);
            ur_6_6.role = r._id;
            ur_6_6.unit = u4._id;
            ur_6_6.segment = b13._id;
            ur_6_6.save(function(err, user) {
                console.log("Save user_6_6");
                ep.emit('user_6_6', user);
            });
            var ur_6_7 = new UserModel(user_6_7);
            ur_6_7.role = r._id;
            ur_6_7.unit = u4._id;
            ur_6_7.segment = b13._id;
            ur_6_7.save(function(err, user) {
                console.log("Save user_6_7");
                ep.emit('user_6_7', user);
            });
            var ur_6_8 = new UserModel(user_6_8);
            ur_6_8.role = r._id;
            ur_6_8.unit = u4._id;
            ur_6_8.segment = b13._id;
            ur_6_8.save(function(err, user) {
                console.log("Save user_6_8");
                ep.emit('user_6_8', user);
            });


            var ur_7_1 = new UserModel(user_7_1);
            ur_7_1.role = r._id;
            ur_7_1.unit = u5._id;
            ur_7_1.segment = b21._id;
            ur_7_1.save(function(err, user) {
                console.log("Save user_7_1");
                ep.emit('user_7_1', user);
            });
            var ur_7_2 = new UserModel(user_7_2);
            ur_7_2.role = r._id;
            ur_7_2.unit = u5._id;
            ur_7_2.segment = b21._id;
            ur_7_2.save(function(err, user) {
                console.log("Save user_7_2");
                ep.emit('user_7_2', user);
            });
            var ur_7_3 = new UserModel(user_7_3);
            ur_7_3.role = r._id;
            ur_7_3.unit = u5._id;
            ur_7_3.segment = b21._id;
            ur_7_3.save(function(err, user) {
                console.log("Save user_7_3");
                ep.emit('user_7_3', user);
            });

            var ur_8_1 = new UserModel(user_8_1);
            ur_8_1.role = r._id;
            ur_8_1.unit = u5._id;
            ur_8_1.segment = b22._id;
            ur_8_1.save(function(err, user) {
                console.log("Save user_8_1");
                ep.emit('user_8_1', user);
            });
            var ur_8_2 = new UserModel(user_8_2);
            ur_8_2.role = r._id;
            ur_8_2.unit = u5._id;
            ur_8_2.segment = b22._id;
            ur_8_2.save(function(err, user) {
                console.log("Save user_8_2");
                ep.emit('user_8_2', user);
            });
            var ur_8_3 = new UserModel(user_8_3);
            ur_8_3.role = r._id;
            ur_8_3.unit = u5._id;
            ur_8_3.segment = b22._id;
            ur_8_3.save(function(err, user) {
                console.log("Save user_8_3");
                ep.emit('user_8_3', user);
            });



            var ur_9_1 = new UserModel(user_9_1);
            ur_9_1.role = r._id;
            ur_9_1.unit = u5._id;
            ur_9_1.segment = b23._id;
            ur_9_1.save(function(err, user) {
                console.log("Save user_9_1");
                ep.emit('user_9_1', user);
            });
            var ur_9_2 = new UserModel(user_9_2);
            ur_9_2.role = r._id;
            ur_9_2.unit = u5._id;
            ur_9_2.segment = b23._id;
            ur_9_2.save(function(err, user) {
                console.log("Save user_9_2");
                ep.emit('user_9_2', user);
            });
            var ur_9_3 = new UserModel(user_9_3);
            ur_9_3.role = r._id;
            ur_9_3.unit = u5._id;
            ur_9_3.segment = b23._id;
            ur_9_3.save(function(err, user) {
                console.log("Save user_9_3");
                ep.emit('user_9_3', user);
            });
            var ur_9_4 = new UserModel(user_9_4);
            ur_9_4.role = r._id;
            ur_9_4.unit = u5._id;
            ur_9_4.segment = b23._id;
            ur_9_4.save(function(err, user) {
                console.log("Save user_9_4");
                ep.emit('user_9_4', user);
            });


            var ur_10_1 = new UserModel(user_10_1);
            ur_10_1.role = r._id;
            ur_10_1.unit = u6._id;
            ur_10_1.segment = s3._id;
            ur_10_1.save(function(err, user) {
                console.log("Save user_10_1");
                ep.emit('user_10_1', user);
            });
            var ur_10_2 = new UserModel(user_10_2);
            ur_10_2.role = r._id;
            ur_10_2.unit = u6._id;
            ur_10_2.segment = s3._id;
            ur_10_2.save(function(err, user) {
                console.log("Save user_10_2");
                ep.emit('user_10_2', user);
            });
            var ur_10_3 = new UserModel(user_10_3);
            ur_10_3.role = r._id;
            ur_10_3.unit = u6._id;
            ur_10_3.segment = s3._id;
            ur_10_3.save(function(err, user) {
                console.log("Save user_10_3");
                ep.emit('user_10_3', user);
            });
            var ur_10_4 = new UserModel(user_10_4);
            ur_10_4.role = r._id;
            ur_10_4.unit = u6._id;
            ur_10_4.segment = s3._id;
            ur_10_4.save(function(err, user) {
                console.log("Save user_10_4");
                ep.emit('user_10_4', user);
            });
            var ur_10_5 = new UserModel(user_10_5);
            ur_10_5.role = r._id;
            ur_10_5.unit = u6._id;
            ur_10_5.segment = s3._id;
            ur_10_5.save(function(err, user) {
                console.log("Save user_10_5");
                ep.emit('user_10_5', user);
            });
            var ur_10_6 = new UserModel(user_10_6);
            ur_10_6.role = r._id;
            ur_10_6.unit = u6._id;
            ur_10_6.segment = s3._id;
            ur_10_6.save(function(err, user) {
                console.log("Save user_10_6");
                ep.emit('user_10_6', user);
            });
            var ur_10_7 = new UserModel(user_10_7);
            ur_10_7.role = r._id;
            ur_10_7.unit = u6._id;
            ur_10_7.segment = s3._id;
            ur_10_7.save(function(err, user) {
                console.log("Save user_10_7");
                ep.emit('user_10_7', user);
            });
            var ur_10_8 = new UserModel(user_10_8);
            ur_10_8.role = r._id;
            ur_10_8.unit = u6._id;
            ur_10_8.segment = s3._id;
            ur_10_8.save(function(err, user) {
                console.log("Save user_10_8");
                ep.emit('user_10_8', user);
            });
            var ur_10_9 = new UserModel(user_10_9);
            ur_10_9.role = r._id;
            ur_10_9.unit = u6._id;
            ur_10_9.segment = s3._id;
            ur_10_9.save(function(err, user) {
                console.log("Save user_10_9");
                ep.emit('user_10_9', user);
            });


            var ur_11_1 = new UserModel(user_11_1);
            ur_11_1.role = r._id;
            ur_11_1.unit = u7._id;
            ur_11_1.segment = s4._id;
            ur_11_1.save(function(err, user) {
                console.log("Save user_11_1");
                ep.emit('user_11_1', user);
            });
            var ur_11_2 = new UserModel(user_11_2);
            ur_11_2.role = r._id;
            ur_11_2.unit = u7._id;
            ur_11_2.segment = s4._id;
            ur_11_2.save(function(err, user) {
                console.log("Save user_11_2");
                ep.emit('user_11_2', user);
            });
            var ur_11_3 = new UserModel(user_11_3);
            ur_11_3.role = r._id;
            ur_11_3.unit = u7._id;
            ur_11_3.segment = s4._id;
            ur_11_3.save(function(err, user) {
                console.log("Save user_11_3");
                ep.emit('user_11_3', user);
            });
            var ur_11_4 = new UserModel(user_11_4);
            ur_11_4.role = r._id;
            ur_11_4.unit = u7._id;
            ur_11_4.segment = s4._id;
            ur_11_4.save(function(err, user) {
                console.log("Save user_11_4");
                ep.emit('user_11_4', user);
            });
            var ur_11_5 = new UserModel(user_11_5);
            ur_11_5.role = r._id;
            ur_11_5.unit = u7._id;
            ur_11_5.segment = s4._id;
            ur_11_5.save(function(err, user) {
                console.log("Save user_11_5");
                ep.emit('user_11_5', user);
            });
            var ur_11_6 = new UserModel(user_11_6);
            ur_11_6.role = r._id;
            ur_11_6.unit = u7._id;
            ur_11_6.segment = s4._id;
            ur_11_6.save(function(err, user) {
                console.log("Save user_11_6");
                ep.emit('user_11_6', user);
            });
            var ur_11_7 = new UserModel(user_11_7);
            ur_11_7.role = r._id;
            ur_11_7.unit = u7._id;
            ur_11_7.segment = s4._id;
            ur_11_7.save(function(err, user) {
                console.log("Save user_11_7");
                ep.emit('user_11_7', user);
            });
            var ur_11_8 = new UserModel(user_11_8);
            ur_11_8.role = r._id;
            ur_11_8.unit = u7._id;
            ur_11_8.segment = s4._id;
            ur_11_8.save(function(err, user) {
                console.log("Save user_11_8");
                ep.emit('user_11_8', user);
            });
            var ur_11_9 = new UserModel(user_11_9);
            ur_11_9.role = r._id;
            ur_11_9.unit = u7._id;
            ur_11_9.segment = s4._id;
            ur_11_9.save(function(err, user) {
                console.log("Save user_11_9");
                ep.emit('user_11_9', user);
            });

            var project = new ProjectModel(project1);
            project.save(function(err, project) {
                project.units.push(u1._id);
                project.units.push(u2._id);
                project.units.push(u3._id);
                project.units.push(u4._id);
                project.units.push(u5._id);
                project.units.push(u6._id);
                project.units.push(u7._id);

                project.segments.push(s1._id);
                project.segments.push(s2._id);
                project.segments.push(s3._id);
                project.segments.push(s4._id);

                project.save();

                console.log("Save Project");
                ep.emit('project1', project);

                s1.project = s2.project = s3.project = s4.project = b11.project = b12.project = b13.project = b21.project = b22.project = b23.project = project._id;

                s1.parent = null;
                s2.parent = null;
                s3.parent = null;
                s4.parent = null;

                b11.parent = s1._id;
                b12.parent = s1._id;
                b13.parent = s1._id;

                b21.parent = s2._id;
                b22.parent = s2._id;
                b23.parent = s2._id;

                s1.save();
                s2.save();
                s3.save();
                s4.save();
                b11.save();
                b12.save();
                b13.save();
                b21.save();
                b22.save();
                b23.save();
            });

            next({
                code: 0,
                message: "success"
            });
        });

    });

};
