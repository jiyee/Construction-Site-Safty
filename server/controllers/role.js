var validator = require('validator');
var eventproxy = require('eventproxy');
var RoleModel = require('../models/').RoleModel;

exports.findAll = function(req, res, next) {
    var options = {};
    RoleModel.findBy(options, function(err, roles) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'roles': roles
        });
    });
};

exports.findById = function (req, res, next) {
    var role_id = validator.trim(req.params.role_id);
    var options = {
        findOne: true,
        conditions: {   
            _id: role_id
        }
    };

    RoleModel.findBy(options, function (err, roles) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'roles': roles
        });
    });
};

exports.create = function(req, res, next) {

    // units数组采用|符号分割
    if (validator.isNull(req.body.units)) {
        req.body.units = [];
    } else {
        req.body.units = req.body.units.split('|');
    }

    var role = new RoleModel(req.body);
    role.save(function(err, role) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'role': role
        });
    });
};
