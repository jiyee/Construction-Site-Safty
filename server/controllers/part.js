var validator = require('validator');
var eventproxy = require('eventproxy');
var Part = require('../proxy/').Part;
var utils = require('../utils');

exports.findAll = function(req, res, next) {
    return Part.findAll(function(err, parts) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'parts': parts
        });
    });
};

exports.findById = function(req, res, next) {
    var part_id = validator.trim(req.params.part_id);

    if (!part_id) {
        return next(util.getError(101));
    }

    Part.findById(part_id, function(err, part) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'part': part
        });
    });
};

exports.findByUnitId = function (req, res, next) {
    var unit_id = validator.trim(req.params.unit_id);

    if (!unit_id) {
        return next(util.getError(101));
    }

    Part.findByUnitId(unit_id, function(err, parts) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'parts': parts
        });
    });
};

exports.list_array = function (req, res, next) {
    var part_id = validator.trim(req.params.part_id);
    var fields = validator.trim(req.params.fields);

    if (!fields) {
        return next(util.getError(101));
    }

    Part.findById(part_id, function (err, part) {
        if (err) {
            return next(err);
        }

        if (!part) {
            return next(util.getError(102));
        }

        var ret = {
            'code': 0
        };

        ret[fields] = part[fields];
        res.send(ret);
    });
};

exports.push_array = function (req, res, next) {
    var root_id = validator.trim(req.params.part_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!root_id || !field || !field_id) {
        return next(util.getError(101));
    }

    var model_name = field.substr(0, 1).toUpperCase() + field.substr(1);
    var Model = require('../proxy')[model_name];

    // 添加时保证part对象存在，移除时忽略
    Model.findById(field_id, function (err, item) {
        if (err) {
            return next(err);
        }

        if (!item) {
            return next(util.getError(102));
        }

        Part.findById(root_id, function (err, part) {
            if (err) {
                return next(err);
            }

            if (!part) {
                return next(util.getError(102));
            }

            var fields = field + 's';
            part[fields] = part[fields]  || [];
            if (part[fields].indexOf(field_id) === -1) {
                part[fields].push(field_id);
                part.save();
            }

            var ret = {
                'code': 0
            };

            ret[fields] = part[fields];
            res.send(ret);
        }, true);

    });
};

exports.slice_array = function (req, res, next) {
    var root_id = validator.trim(req.params.part_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!root_id || !field || !field_id) {
        return next(util.getError(101));
    }

    Part.findById(root_id, function (err, part) {
        if (err) {
            return next(err);
        }

        if (!part) {
            return next(util.getError(102));
        }

        var fields = field + 's';
        part[fields] = part[fields]  || [];
        var index = part[fields].indexOf(field_id);
        if (index > -1) {
            part[fields].splice(index, 1);
            part.save();
        }

        var ret = {
            'code': 0
        };

        ret[fields] = part[fields];
        res.send(ret);
    }, true);
};

exports.update = function (req, res, next) {
    var part_id = validator.trim(req.params.part_id);

    if (!part_id) {
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

    Part.findById(part_id, function (err, part) {
        if (err) {
            return next(err);
        }

        if (!part) {
            return next(util.getError(102));
        }

        _.extend(part, update);
        part.save();

        res.send({
            'code': 0,
            'part': part
        });
    }, true);

};

exports.create = function(req, res, next) {
    var name = validator.trim(req.body.name);
    var description = validator.trim(req.body.description);
    var abbr = validator.trim(req.body.abbr);
    var type = validator.trim(req.body.type);
    var is_leaf = validator.trim(req.body.is_leaf);

    Part.newAndSave(name, description, abbr, type, is_leaf, function(err, part) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'part': part
        });
    });
};
