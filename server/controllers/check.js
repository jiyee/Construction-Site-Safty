var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var TableModel = require('../models/').TableModel;
var CheckModel = require('../models/').CheckModel;
var UserModel = require('../models/').UserModel;
var UnitModel = require('../models/').UnitModel;
var SegmentModel = require('../models/').SegmentModel;

exports.findAll = function (req, res, next) {
    var options = {};
    CheckModel.findBy(options, function(err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

exports.findById = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    if (!checkId) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: checkId
        }
    };

    CheckModel.findBy(options, function (err, check) {
        if (err) {
            return next(err);
        }

        if (!check) {
            return next(utils.getError(102));
        }

        res.send({
            'code': 0,
            'status': 'success',
            'check': check
        });
    });
};

exports.findByProcessCurrentUserId = function (req, res, next) {
    var userId = validator.trim(req.params.user_id);

    if (!userId) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            'process.current.user': userId
        }
    };

    CheckModel.findBy(options, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

exports.findBySessionUser = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var userId = req.session.user._id;

    if (!userId) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            'process.current.user': userId
        }
    };

    CheckModel.findBy(options, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

// TODO 递归查询项目-标段-分部管辖下的所有日常巡查记录
// TODO 测试结果正确性
exports.findByDateInterval = function (req, res, next) {
    var projectId = validator.trim(req.params.project_id);
    var sectionId = validator.trim(req.params.section_id);
    var branchId = validator.trim(req.params.branch_id);
    var startDate = validator.trim(req.params.start_date);
    var endDate = validator.trim(req.params.end_date);

    if (!projectId || !sectionId || !startDate || !endDate) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {
            project: projectId,
            section: sectionId,
            date: {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            }
        },
        select: 'uuid project section branch table user date target comment'
    };

    if (branchId) {
        options.conditions.branch = branchId;
    }

    // 找出所在项目、标段、分部管辖下所有的日常巡查记录
    CheckModel.findBy(options, function (err, checks) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'checks': checks
        });
    });
};

exports.delete = function (req, res, next) {
    var checkId = validator.trim(req.params.check_id);

    var conditions = {
        _id: checkId
    };
    CheckModel.findOneAndRemove(conditions, function (err, check) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'check': check
        });
    });
};

exports.create = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    if (!req.body.file) {
        return next(utils.getError(102));
    }

    var ep = new eventproxy();
    ep.on('table', function (table) {
        var check = new CheckModel(req.body);
        check.user = req.session.user._id;
        check.uuid = Date.now();
        check.table = table._id;

        // 初始化流程
        check.process.createAt = Date.now();
        check.process.updateAt = Date.now();
        check.process.active = false;
        check.process.status = '';
        check.process.current.user = req.session.user._id;

        check.save(function(err, check) {
            if (err) {
                return next(err);
            }

            res.send({
                'status': 'success',
                'code': 0,
                'check': check
            });
        });
    });

    // 创建日常巡检表
    var table = new TableModel();
    var proto = require('../data/' + req.body.file + '.json');
    _.extend(table, proto);
    table.uuid = Date.now();
    table.save(function (err, table) {
        if (err) {
            return next(err);
        }

        ep.emit('table', table);
    });

};
