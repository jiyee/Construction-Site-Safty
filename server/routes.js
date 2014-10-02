var express = require('express');
var router = express.Router();
var role = require('./controllers/role');
var user = require('./controllers/user');
var department = require('./controllers/department');

router.get('/', function (req, res) {
    res.render('index', {
        title: '平安工地'
    });
});

// 用户接口
router.get('/users', user.find);
router.get('/user/:user_id', user.findById);
router.post('/user/signup', user.create);

// 角色接口
router.get('/roles', role.find);
router.get('/role/:role_id/users', user.findByRoleId);
router.post('/role/create', role.create);

// 部门接口
router.get('/departments', department.find);
router.get('/department/:department_id/users', user.findByDepartmentId);
router.post('/department/create', department.create);

module.exports = router;
