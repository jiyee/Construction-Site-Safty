var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var TableModel = require('../models/').TableModel;
var EvaluationModel = require('../models/').EvaluationModel;
var UserModel = require('../models/').UserModel;

exports.findAll = function (req, res, next) {
    var options = {};
    EvaluationModel.findBy(options, function(err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
        });
    });
};

exports.findById = function (req, res, next) {
    var evaluation_id = validator.trim(req.params.evaluation_id);

    if (!evaluation_id) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {   
            _id: evaluation_id
        }
    };

    EvaluationModel.findBy(options, function (err, evaluation) {
        if (err) {
            return next(err);
        }
        
        res.send({
            'code': 0,
            'status': 'success',
            'evaluation': evaluation
        });
    });
};

exports.findByUserId = function (req, res, next) {
    var user_id = validator.trim(req.params.user_id);

    if (!user_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {   
            evaluation_users: user_id
        }
    };

    EvaluationModel.findBy(options, function (err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
        });
    });
};

exports.findBySessionUser = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var user_id = req.session.user._id;

    if (!user_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {   
            evaluation_users: user_id
        }
    };

    EvaluationModel.findBy(options, function (err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
        });
    });
};

exports.findByProjectId = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);

    if (!project_id) {
        return next(utils.getError(101));
    }

    var options = {
        conditions: {   
            project: project_id
        }
    };

    EvaluationModel.findBy(options, function (err, evaluations) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'evaluations': evaluations
        });
    });
};

exports.create = function (req, res, next) {
    if (!req.session.user) {
        return next(utils.getError(105));
    }

    var ep = new eventproxy();

    var options = {
        conditions: {
            unit: req.session.user.unit._id 
        }
    };
    UserModel.findBy(options, function (err, users) {
        ep.emit('users', users);  
    });

    ep.on('users', function (users) {
        var files = ['SGJC', 'SGXCTY', 'SGXCGL', 'SGXCSY'];

        ep.after('table', files.length, function (tables) {
            var evaluation = new EvaluationModel(req.body);
            evaluation.evaluation_users = _.pluck(users, '_id');
            evaluation.uuid = Date.now(); 
            evaluation.tables = _.pluck(tables, '_id');

            evaluation.save(function(err, evaluation) {
                if (err) {
                    return next(err);
                }

                res.send({
                    'status': 'success',
                    'code': 0,
                    'evaluation': evaluation
                });
            });
        });

        // 创建检查表
        _.each(files, function (file) {
            var table = new TableModel();
            var proto = require('../data/' + file + '.json');
            _.extend(table, proto);
            table.uuid = Date.now();
            table.save(function (err, table) {
                if (err) {
                    return next(err);
                }

                ep.emit('table', table);
            });
        });
    });

}; 