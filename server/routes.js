var express = require('express');
var router = express.Router();
var role = require('./controllers/role');
var user = require('./controllers/user');
var unit = require('./controllers/unit');
var project = require('./controllers/project');
var part = require('./controllers/part');
var table = require('./controllers/table');
var check = require('./controllers/check');
var setup = require('./controllers/setup');

router.get('/', function (req, res) {
    res.render('index', {
        title: '平安工地'
    });
});

// NOTICE:
// 列表添加用insert，移除用remove，元素创建用create，删除用delete

// 权限接口
router.post('/login', user.login);
router.get('/auth', user.auth);

// 用户接口
router.get('/users', user.find);
router.get('/user/:user_id', user.findById);
router.get('/user/:user_id/checks', check.findByUserId);
router.post('/user/create', user.create);

// 角色接口
router.get('/roles', role.find);
router.get('/role/:role_id', role.findById);
router.get('/role/:role_id/users', user.findByRoleId);
router.post('/role/create', role.create);

// 部门接口
router.get('/units', unit.find);
router.get('/unit/:unit_id', unit.findById);
router.get('/unit/:unit_id/users', user.findByUnitId);
router.get('/unit/:unit_id/parts', part.findByUnitId);
router.post('/unit/create', unit.create);

// 项目接口
router.get('/projects', project.find);
router.post('/project/create', project.create);
router.post('/project/:project_id/update', project.update);
router.get('/project/:project_id', project.findById);
router.get('/project/:project_id/:fields', project.list_array);
router.post('/project/:project_id/:field/insert', project.push_array);
router.post('/project/:project_id/:field/remove', project.slice_array);

// 项目组成接口
router.get('/parts', part.find);
router.post('/part/create', part.create);
router.get('/part/:part_id', part.findById);
router.get('/part/:part_id/:fields', part.list_array);
router.post('/part/:part_id/:field/insert', part.push_array);
router.post('/part/:part_id/:field/remove', part.slice_array);

// 安全检查表接口
router.get('/tables', table.find);
router.get('/table/:table_id', table.findById);
router.post('/table/create', table.create);
router.post('/table/:table_id/delete', table.delete);
router.post('/table/:table_id/update', table.update);

// 安全检查接口
router.get('/checks', check.findBySessionUser);
router.get('/checks/all', check.find);
router.get('/check/:check_id', check.findById);
router.post('/check/create', check.create);
router.post('/check/:check_id/delete', check.delete);
router.post('/check/:check_id/forward', check.forward);
router.post('/check/:check_id/backward', check.backward);
router.post('/check/:check_id/revert', check.revert);
router.post('/check/:check_id/restore', check.restore);
router.post('/check/:check_id/end', check.end);

// 数据库测试接口
router.get('/setup', setup.mongo);

module.exports = router;
