var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

// Notice, Relative Path, Absolute Path: /users/
router.get('/', function (req, res) {
    res.send({a: 1});
});

router.post('/signup', user.signup);

module.exports = router;
