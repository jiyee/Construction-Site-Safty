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
var setup = require('./controllers/setup');

router.get('/', function(req, res) {
    res.render('index', {
        title: '平安工地'
    });
});

// NOTICE:
// 列表添加用insert，移除用remove，元素创建用create，删除用delete

// 权限接口
router.post('/login', user.login);
router.post('/logout', user.logout);
router.get('/auth', user.auth);

// 用户接口
router.get('/users/all', user.findAll);
router.get('/user/:user_id', user.findById);
router.get('/user/:user_id/checks', check.findByProcessCurrentUserId);
router.get('/user/:user_id/evaluations', evaluation.findByUserId);
router.get('/user/:user_id/captures', capture.findByUserId);
router.post('/user/create', user.create);

// 角色接口
router.get('/roles/all', role.findAll);
router.get('/role/:role_id', role.findById);
router.get('/role/:role_id/users', user.findByRoleId);
router.post('/role/create', role.create);

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

// 项目组成接口
router.get('/segments/all', segment.findAll);
router.post('/segment/create', segment.create);
router.get('/segment/:segment_id', segment.findById);
router.get('/segment/:segment_id/users', user.findBySegmentId);
router.get('/segment/:segment_id/:fields', segment.list_array);
router.post('/segment/:segment_id/:field/insert', segment.push_array);
router.post('/segment/:segment_id/:field/remove', segment.slice_array);

// 安全检查表接口
router.get('/tables/all', table.findAll);
router.get('/table/:table_id', table.findById);
router.post('/table/create', table.create);
router.post('/table/:table_id/delete', table.delete);
router.post('/table/:table_id/update', table.update);

// 安全检查接口
router.get('/checks', check.findBySessionUser);
router.get('/checks/all', check.findAll);
router.get('/checks/list/:project_id/:segment_id/:start_date/:end_date', check.findByDateInterval);
router.get('/check/:check_id', check.findById);
router.post('/check/create', check.create);
router.post('/check/:check_id/delete', check.delete);
router.post('/check/:check_id/forward', check.forward);
router.post('/check/:check_id/backward', check.backward);
router.post('/check/:check_id/revert', check.revert);
router.post('/check/:check_id/restore', check.restore);
router.post('/check/:check_id/end', check.end);

// 考核评价接口
router.get('/evaluations', evaluation.findBySessionUser);
router.get('/evaluations/all', evaluation.findAll);
router.get('/evaluation/:evaluation_id', evaluation.findById);
router.post('/evaluation/create', evaluation.create);
router.post('/evaluation/:evaluation_id/update', evaluation.update);

// 角色接口
router.get('/captures/all', capture.findAll);
router.get('/capture/:capture_id', capture.findById);
router.post('/capture/create', capture.create);

// 数据库测试接口
router.get('/setup', setup.mongo);

module.exports = router;
