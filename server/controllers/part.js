var validator = require('validator');
var eventproxy = require('eventproxy');
var Part = require('../proxy/').Part;

exports.find = function(req, res, next) {
    return Part.find(function(err, parts) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'parts': parts
        });
    });
};

exports.findById = function(req, res, next) {
    var part_id = validator.trim(req.params.part_id);

    if (!part_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    Part.findById(part_id, function(err, part) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'part': part
        });
    });
};

exports.list_parts = function (req, res, next) {
    var part_id = validator.trim(req.params.part_id);

    if (!part_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    Part.findById(part_id, function (err, part) {
        if (err) {
            return next(err);
        }

        if (!part) {
            return next({
                code: 102,
                message: '对象不存在'
            });
        }

        res.send({
            'status': 'success',
            'code': 0,
            'parts': part.parts
        });
    });
};

exports.insert_part = function (req, res, next) {
    var root_id = validator.trim(req.params.part_id);
    var part_id = validator.trim(req.body.part_id);

    if (!root_id || !part_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    // 添加时保证part对象存在，移除时忽略
    Part.findById(part_id, function (err, part) {
        if (err) {
            return next(err);
        }

        if (!part) {
            return next({
                code: 102,
                message: '对象不存在'
            });
        }

        Part.findById(root_id, function (err, part) {
            if (err) {
                return next(err);
            }

            if (!part) {
                return next({
                    code: 102,
                    message: '对象不存在'
                });
            }

            if (part.parts.indexOf(part_id) === -1) {
                part.parts.push(part_id);
                part.save();
            }

            res.send({
                'status': 'success',
                'code': 0,
                'parts': part.parts
            });
        }, true);

    });
};

exports.remove_part = function (req, res, next) {
    var root_id = validator.trim(req.params.part_id);
    var part_id = validator.trim(req.body.part_id);

    if (!root_id || !part_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    Part.findById(root_id, function (err, part) {
        if (err) {
            return next(err);
        }

        if (!part) {
            return next({
                code: 102,
                message: '对象不存在'
            });
        }

        var index = part.parts.indexOf(part_id);
        if (index > -1) {
            part.parts.splice(index, 1);
            part.save();
        }

        res.send({
            'status': 'success',
            'code': 0,
            'parts': part.parts
        });
    }, true);
};

exports.update = function (req, res, next) {
    var part_id = validator.trim(req.params.part_id);

    if (!part_id) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    var fields = ['name', 'description', 'type'];
    var update = {};
    _.each(fields, function (field) {
        var value = req.body[field];
        if (!validator.isNull(value)) { // 删除某元素时填入占位字符
           update[field] = validator.trim(value) || null;
        }
    });

    Project.findById(part_id, function (err, project) {
        if (err) {
            return next(err);
        }

        if (!project) {
            return next({
                code: 102,
                message: '对象不存在'
            });
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

exports.create = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var description = validator.trim(req.body.description);
    var abbr = validator.trim(req.body.abbr);
    var type = validator.trim(req.body.type);
    var is_leaf = validator.trim(req.body.is_leaf);

    Part.newAndSave(name, description, abbr, type, is_leaf, function(err) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'name': name
        });
    });

    console.log("/part/create => new and save.");
};
