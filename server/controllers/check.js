var validator = require('validator');
var eventproxy = require('eventproxy');
var Table = require('../proxy/').Table;
var Check = require('../proxy/').Check;

exports.find = function(req, res, next) {
    return Check.find(function(err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'checks': checks
        });
    });
};

exports.findById = function(req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    return Check.findById(check_id, function(err, check) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'check': check
        });
    });
};

exports.create = function(req, res, next) {
    var project_id = validator.trim(req.body.project_id);
    var section_id = validator.trim(req.body.section_id);
    var branch_id = validator.trim(req.body.branch_id);
    var place_id = validator.trim(req.body.place_id);
    var target = validator.trim(req.body.target);
    var file = validator.trim(req.body.file);

    if (!project_id || !file) {
        return next({
            message: 'no project_id or file'
        });
    }

    Table.newAndSave(file, function (err, table) {
      if (err || !table._id) {
        return next(err || {
          message: 'no table_id'
        });
      }

      Check.newAndSave(project_id, section_id, branch_id, place_id, target, table._id, function (err, check) {
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
    });
};
