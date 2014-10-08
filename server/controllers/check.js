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
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'check': check
        });
    });
};

exports.delete = function (req, res, next) {
    var check_id = validator.trim(req.params.check_id);

    return Check.findById(check_id, function(err, check) {
        if (err) {
            return next(err);
        }

        if (check.table && check.table._id) {
            Table.delete(check.table._id, function (err, table) {
                if (err) {
                    return next(err);
                }
            });
        }

        check.remove();

        res.send({
            'status': 'success',
            'code': 0
        });
    });
};

exports.create = function(req, res, next) {
    var project_id = validator.trim(req.body.project_id);
    var part_id = validator.trim(req.body.part_id);
    var file = validator.trim(req.body.file);
    var check_target = validator.trim(req.body.check_target);
    var check_user_id = req.session.user ? req.session.user._id : null;

    if (!project_id || !part_id || !file) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    Table.newAndSave(file, function (err, table) {
        if (err) {
            return next(err);
        }

        if (!table) {
            return next({
                code: 102,
                message: '对象不存在'
            });
        }

        Check.newAndSave(project_id, part_id, table._id, check_target, check_user_id, function(err, check) {
            if (err) {
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
