var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var utils = require('../utils');
var SegmentModel = require('../models/').SegmentModel;

exports.findAll = function(req, res, next) {
    var options = {};
    SegmentModel.findBy(options, function(err, segments) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'segments': segments
        });
    });
};

exports.findById = function(req, res, next) {
    var segment_id = validator.trim(req.params.segment_id);
    var options = {
        findOne: true,
        conditions: {
            _id: segment_id
        }
    };

    SegmentModel.findBy(options, function (err, segment) {
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
                        'segment': segment
                    });
                }
            }
        };

        // 遍历子节点，深度populated
        deepPopulate(err, segment);
    });
};

exports.findByUnitId = function (req, res, next) {
    var unit_id = validator.trim(req.params.unit_id);
    var options = {
        conditions: {
            units: unit_id
        }
    };

    SegmentModel.findBy(options, function (err, segments) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'segments': segments
        });
    });
};

exports.list_array = function (req, res, next) {
    var segment_id = validator.trim(req.params.segment_id);
    var fields = validator.trim(req.params.fields);

    if (!fields) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: segment_id
        },
        select: fields
    };

    SegmentModel.findBy(options, function (err, segment) {
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
                    SegmentModel.populate(child, {
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

                    ret[fields] = segment[fields];
                    res.send(ret);
                }
            }
        };

        // 遍历子节点，深度populated
        deepPopulate(err, segment);
    });
};

exports.push_array = function (req, res, next) {
    var segment_id = validator.trim(req.params.segment_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!segment_id || !field || !field_id) {
        return next(utils.getError(101));
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

        options.conditions._id = segment_id;
        SegmentModel.findBy(options, function (err, segment) {
            if (err) {
                return next(err);
            }

            if (!segment) {
                return next(utils.getError(102));
            }

            var fields = field + 's';
            segment[fields] = segment[fields]  || [];
            if (!~segment[fields].indexOf(field_id)) {
                segment[fields].push(field_id);
                segment.save();
            }

            var ret = {
                'code': 0,
                'status': 'success'
            };

            ret[fields] = segment[fields];
            res.send(ret);
        });

    });
};

exports.slice_array = function (req, res, next) {
    var root_id = validator.trim(req.params.segment_id);
    var field = validator.trim(req.params.field);
    var field_id = validator.trim(req.body[field + '_id']);

    if (!root_id || !field || !field_id) {
        return next(utils.getError(101));
    }

    var options = {
        findOne: true,
        conditions: {
            _id: root_id
        }
    };

    SegmentModel.findBy(options, function (err, segment) {
        if (err) {
            return next(err);
        }

        if (!segment) {
            return next(utils.getError(102));
        }

        var fields = field + 's';
        segment[fields] = segment[fields]  || [];
        var index = segment[fields].indexOf(field_id);
        if (!!~index) {
            segment[fields].splice(index, 1);
            segment.save();
        }

        var ret = {
            'code': 0,
            'status': 'success'
        };

        ret[fields] = segment[fields];
        res.send(ret);
    });
};

exports.update = function (req, res, next) {
    var segment_id = validator.trim(req.params.segment_id);

    if (!segment_id) {
        return next(utils.getError(101));
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
        _id: segment_id
    };
    SegmentModel.findOneAndUpdate(conditions, update, function (err, segment) {
        if (err) {
            return next(err);
        }

        res.send({
            'code': 0,
            'status': 'success',
            'segment': segment
        });
    });

};

exports.create = function(req, res, next) {
    var segment = new SegmentModel(req.body);
    segment.save(function(err, segment) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'segment': segment
        });
    });
};
