var express = require('express');
var router = express.Router();
var role = require('./controllers/role');
var user = require('./controllers/user');

router.get('/', function (req, res) {
    res.render('index', {
        title: '平安工地'
    });
});

// router.get('/user', function (req, res) {
//     res.send({a: 1});
// });

router.post('/user/signup', user.signup);

router.get('/roles', role.find);
router.get('/role/:role_id/users', user.findByRoleId);
router.post('/role/add', role.add);

module.exports = router;
