var express = require('express');
var router = express.Router();
var role = require('./controllers/role');
var user = require('./controllers/user');
var unit = require('./controllers/unit');

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
router.get('/units', unit.find);
router.get('/unit/:unit_id/users', user.findByUnitId);
router.post('/unit/create', unit.create);

module.exports = router;
