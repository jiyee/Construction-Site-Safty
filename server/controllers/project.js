var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var ProjectModel = require('../models/').ProjectModel;
var SegmentModel = require('../models/').SegmentModel;

exports.findAll = function(req, res, next) {
    var options = {};
    ProjectModel.findBy(options, function(err, projects) {
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

    var options = {
        findOne: true,
        conditions: {
            _id: project_id
        }
    };

    ProjectModel.findBy(options, function (err, project) {
        if (err) {
            return next(err);
        }

        var __total = 0;
        var __done = 0;
        var deepPopulate = function(err, parent) {
            if (parent.segments && parent.segments.length > 0) {
                __total += parent.segments.length;
                __done += 1;

                _.each(parent.segments, function(child) {
                    SegmentModel.populate(child, {
                        path: 'segments'
                    }, deepPopulate);
                });
            } else {
                __done += 1;

                if (__done > __total) {
                    res.send({
                        'status': 'success',
                        'code': 0,
                        'project': project
                    });
                }
            }
        };

        // 遍历子节点，深度populated
        deepPopulate(err, project);
    });
};

exports.list_array = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var fields = validator.trim(req.params.fields);

    if (!project_id || !fields) {
        return next(util.getError(101));
    }

    var field = fields.substr(0, fields.length - 1);
    var model_name = field.substr(0, 1).toUpperCase() + field.substr(1) + 'Model';
    var refModel = require('../models')[model_name];

    var options = {
        findOne: true,
        conditions: {
            _id: project_id
        },
        select: fields
    };

    ProjectModel.findBy(options, function (err, project) {
        if (err) {
            return next(err);
        }

        var __total = 0;
        var __done = 0;
        var deepPopulate = function(err, parent) {
            if (parent[fields] && parent[fields].length > 0) {
                __total += parent[fields].length;
                __done += 1;

                _.each(parent[fields], function(child) {
                    refModel.populate(child, {
                        path: fields
                    }, deepPopulate);
                });
            } else {
                __done += 1;

                if (__done > __total) {
                    var ret = {
                        'status': 'success',
                        'code': 0
                    };

                    ret[fields] = project[fields];
                    res.send(ret);
                }
            }
        };

        // 遍历子节点，深度populated
        deepPopulate(err, project);
    });
};

exports.push_array = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!project_id || !field || !field_id) {
        return next(util.getError(101));
    }

    var model_name = field.substr(0, 1).toUpperCase() + field.substr(1) + 'Model';
    var refModel = require('../models')[model_name];

    var options = {
        findOne: true,
        conditions: {
            _id: field_id
        }
    };

    // 添加时保证segment对象存在，移除时忽略
    refModel.findBy(options, function (err, item) {
        if (err) {
            return next(err);
        }

        if (!item) {
            return next(utils.getError(102));
        }

        options.conditions._id = project_id;
        ProjectModel.findBy(options, function (err, project) {
            if (err) {
                return next(err);
            }

            if (!project) {
                return next(utils.getError(102));
            }

            var fields = field + 's';
            project[fields] = project[fields]  || [];
            if (!~project[fields].indexOf(field_id)) {
                project[fields].push(field_id);
                project.save();
            }

            var ret = {
                'code': 0,
                'status': 'success'
            };

            ret[fields] = project[fields];
            res.send(ret);
        });

    });
};

exports.slice_array = function (req, res, next) {
    var project_id = validator.trim(req.params.project_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!project_id || !field || !field_id) {
        return next(util.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: project_id
        }
    };

    ProjectModel.findBy(options, function (err, project) {
        if (err) {
            return next(err);
        }

        if (!project) {
            return next(utils.getError(102));
        }

        var fields = field + 's';
        project[fields] = project[fields]  || [];
        var index = project[fields].indexOf(field_id);
        if (!!~index) {
            project[fields].splice(index, 1);
            project.save();
        }

        var ret = {
            'code': 0,
            'status': 'success'
        };

        ret[fields] = project[fields];
        res.send(ret);
    });
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

    var conditions = {
        _id: project_id
    };
    ProjectModel.findOneAndUpdate(conditions, update, function (err, project) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'project': project
        });
    });
};

exports.create = function (req, res, next) {
    var project = new ProjectModel(req.body);
    project.save(function(err, project) {
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
