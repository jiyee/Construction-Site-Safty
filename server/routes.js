var express = require('express');
var router = express.Router();
var role = require('./controllers/role');
var user = require('./controllers/user');
var unit = require('./controllers/unit');
var project = require('./controllers/project');
var segment = require('./controllers/segment');
var table = require('./controllers/table');
var check = require('./controllers/check');
var evaluation = require('./controllers/evaluation');
var capture = require('./controllers/capture');
var setup1 = require('./controllers/setup1');
var setup2 = require('./controllers/setup2');
var setup3 = require('./controllers/setup3');
var setup4 = require('./controllers/setup4');
var setup5 = require('./controllers/setup5');
var setup6 = require('./controllers/setup6');

router.get('/', function(req, res) {
    res.render('index', {
        title: '平安工地'
    });
});

// NOTICE:
// 列表添加用insert，移除用remove，元素创建用create，删除用delete

// 权限接口
router.get('/auth', user.auth);
router.post('/login', user.login);
router.post('/logout', user.logout);

// 用户接口
router.get('/users/all', user.findAll);
router.get('/user/:userId', user.findById);
router.get('/user/:userId/checks', check.findByUser);
router.get('/user/:userId/evaluations', evaluation.findByUserId);
router.get('/user/:userId/captures', capture.findByUser);
router.post('/user/create', user.create);

// 用户待办事项接口
router.get('/process/:userId/captures', capture.findByProcessCurrentUserId);
router.get('/process/:userId/checks', check.findByProcessCurrentUserId);
router.get('/process/:userId/evaluations', evaluation.findByProcessCurrentUserId);

// 部门接口
router.get('/units/all', unit.findAll);
router.get('/unit/:unit_id', unit.findById);
router.get('/unit/:unit_id/users', user.findByUnitId);
router.get('/unit/:unit_id/segments', segment.findByUnitId);
router.post('/unit/create', unit.create);

// 项目接口
router.get('/projects/all', project.findAll);
router.post('/project/create', project.create);
router.post('/project/:project_id/update', project.update);
router.get('/project/:project_id', project.findById);
router.get('/project/:project_id/:fields', project.list_array);
router.post('/project/:project_id/:field/insert', project.push_array);
router.post('/project/:project_id/:field/remove', project.slice_array);

// 标段、分部接口
router.get('/segments/all', segment.findAll);
router.post('/segment/create', segment.create);
router.get('/segment/:segment_id', segment.findById);
router.get('/segment/:segment_id/users', user.findBySegmentId);
router.get('/segment/:segment_id/:fields', segment.list_array);
router.post('/segment/:segment_id/:field/insert', segment.push_array);
router.post('/segment/:segment_id/:field/remove', segment.slice_array);

// 检查表接口
router.get('/tables/all', table.findAll);
router.get('/table/:table_id', table.findById);
router.post('/table/create', table.create);
router.post('/table/:table_id/delete', table.delete);
router.post('/table/:table_id/update', table.update);

// 日常检查接口
router.get('/checks', check.findByUser);
router.get('/checks/all', check.findAll);
router.get('/checks/list/:project_id/:section_id/:start_date/:end_date', check.findByDate);
router.get('/check/:check_id', check.findById);
router.post('/check/create', check.create);
router.post('/check/:check_id/delete', check.delete);

router.post('/check/:check_id/forward', check.forward);
router.post('/check/:check_id/backward', check.backward);
router.post('/check/:check_id/revert', check.revert);
router.post('/check/:check_id/restore', check.restore);
router.post('/check/:check_id/end', check.end);

// 考核评价接口
router.get('/evaluations', evaluation.findByUser);
router.get('/evaluations/all', evaluation.findAll);
router.get('/evaluation/:evaluation_id', evaluation.findById);
router.post('/evaluation/create', evaluation.create);
router.post('/evaluation/:evaluation_id/update', evaluation.update);

router.post('/evaluation/:evaluation_id/forward', evaluation.forward);
router.post('/evaluation/:evaluation_id/backward', evaluation.backward);
router.post('/evaluation/:evaluation_id/revert', evaluation.revert);
router.post('/evaluation/:evaluation_id/restore', evaluation.restore);
router.post('/evaluation/:evaluation_id/end', evaluation.end);

// 安全检查接口
router.get('/captures/all', capture.findAll);
router.get('/captures/list/:project_id/:section_id/:start_date/:end_date', capture.findByDate);
router.get('/capture/:capture_id', capture.findById);
router.post('/capture/create', capture.create);
router.post('/capture/:capture_id/delete', capture.delete);

router.post('/capture/:capture_id/forward', capture.forward);
router.post('/capture/:capture_id/backward', capture.backward);
router.post('/capture/:capture_id/revert', capture.revert);
router.post('/capture/:capture_id/restore', capture.restore);
router.post('/capture/:capture_id/end', capture.end);

// 数据库测试接口
router.get('/setup1', setup1.mongo);
router.get('/setup2', setup2.mongo);
router.get('/setup3', setup3.mongo);
router.get('/setup4', setup4.mongo);
router.get('/setup5', setup5.mongo);
router.get('/setup6', setup6.mongo);
router.get('/setup', [setup1.mongo, setup3.mongo, setup4.mongo, setup6.mongo, function (req, res, next) {
    next({
        code: 100,
        message: 'success'
    });
}]);

module.exports = router;
