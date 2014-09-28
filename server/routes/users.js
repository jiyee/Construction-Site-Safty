var express = require('express');
var router = express.Router();

// Notice, Relative Path, Absolute Path: /users/
router.get('/', function(req, res) {
    res.send("users gogoog");
});

module.exports = router;
