var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var Project = require('../proxy/').Project;
var Part = require('../proxy/').Part;

exports.findAll = function(req, res, next) {
    Project.findAll(function(err, projects) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'projects': projects
        });
    });
};

exports.findById = function(req, res, next) {
    var project_id = validator.trim(req.params.project_id);

    if (!project_id) {
        return next(util.getError(101));
    }

    Project.findById(project_id, function(err, project) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'project': project
        });
    });
};

exports.list_array = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var fields = validator.trim(req.params.fields);

    if (!project_id || !fields) {
        return next(util.getError(101));
    }

    Project.findById(project_id, function (err, project) {
        if (err) {
            return next(err);
        }

        if (!project) {
            return next(util.getError(102));
        }

        var ret = {
            'status': 'success',
            'code': 0
        };

        ret[fields] = project[fields];
        res.send(ret);
    });
};

exports.push_array = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!project_id || !field || !field_id) {
        return next(util.getError(101));
    }

    var model_name = field.substr(0, 1).toUpperCase() + field.substr(1);
    var Model = require('../proxy')[model_name];

    // 添加时保证对象存在，移除时忽略
    Model.findById(field_id, function (err, item) {
        if (err) {
            return next(err);
        }

        if (!item) {
            return next(util.getError(102));
        }

        Project.findById(project_id, function (err, project) {
            if (err) {
                return next(err);
            }

            if (!project) {
                return next(util.getError(102));
            }

            var fields = field + 's';
            project[fields] = project[fields]  || [];
            if (project[fields].indexOf(field_id) === -1) {
                project[fields].push(field_id);
                project.save();
            }

            res.send({
                'status': 'success',
                'code': 0,
                'project': project
            });
        }, true);

    }, true);
};

exports.slice_array = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!project_id || !field || !field_id) {
        return next(util.getError(101));
    }

    Project.findById(project_id, function (err, project) {
        if (err) {
            return next(err);
        }

        if (!project) {
            return next(util.getError(102));
        }

        var fields = field + 's';
        project[fields] = project[fields]  || [];
        var index = project[fields].indexOf(field_id);
        if (index > -1) {
            project[fields].splice(index, 1);
            project.save();
        }

        res.send({
            'status': 'success',
            'code': 0,
            'project': project
        });
    }, true);

};

exports.update = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);

    if (!project_id) {
        return next(util.getError(101));
    }

    var fields = ['name', 'description', 'type'];
    var update = {};
    _.each(fields, function (field) {
        var value = req.body[field];
        if (!validator.isNull(value)) { // 删除某元素时填入占位字符
           update[field] = validator.trim(value) || null;
        }
    });

    Project.findById(project_id, function (err, project) {
        if (err) {
            return next(err);
        }

        if (!project) {
            return next(util.getError(102));
        }

        _.extend(project, update);
        project.save();

        res.send({
            'status': 'success',
            'code': 0,
            'project': project
        });
    }, true);

};

exports.create = function (req, res, next) {
    var name = validator.trim(req.body.name);
    var description = validator.trim(req.body.description);
    var province = validator.trim(req.body.province);

    // 重复插入判断
    Project.newAndSave(name, description, province, function(err, project) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'project': project
        });
    });
};
