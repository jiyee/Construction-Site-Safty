var validator = require('validator');
var eventproxy = require('eventproxy');
var Table = require('../proxy/').Table;
var Check = require('../proxy/').Check;

exports.create = function(req, res, next) {
    var file = validator.trim(req.body.file);
    var project_id = '';
    var section_id = '';
    var branch_id = '';
    var place_id = '';

    if (!project_id || !section_id || !branch_id || !place_id || !file) {
        console.log('empty params: ', project_id, section_id, branch_id, place_id, file);
        return next({
            message: 'empty params.'
        });
    }

    Check.newAndSave(project_id, section_id, branch_id, place_id, file, function(err) {
        if (err) {
            console.log('error: ', err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'check': check
        });
    });

    console.log("/check/create => new and save.");
};
