var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var constants = require('../constants');
var TableModel = require('../models/').TableModel;

exports.findAll = function (req, res, next) {
    var options = {};
    TableModel.findBy(options, function(err, tables) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'tables': tables
        });
    });
};

exports.findById = function (req, res, next) {
    var table_id = validator.trim(req.params.table_id);
    var options = {
        findOne: true,
        conditions: {   
            _id: table_id
        }
    };

    TableModel.findBy(options, function (err, table) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'table': table
        });
    });
};

exports.update = function (req, res, next) {
    var table_id = validator.trim(req.params.table_id);
    var table = validator.trim(req.body.table);

    if (validator.isNull(table_id) || validator.isNull(table)) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    // 检查table数据格式正确性
    try {
        table = JSON.parse(table);
    } catch (ex) {
        return next({
            code: 103,
            message: ex
        });
    }

    if (!table ||
        !table.items ||
        table.items.length === 0) {
        return next({
            code: 103,
            message: '数据错误'
        });
    } 

    var valid = true;
    var message = '';
    var list1 = table.items,
        list2,
        list3;
    _.each(list1, function (item1) {
        if (/[A-Z]+/.test(item1.index)) {
            list2 = item1.items;

            _.each(list2, function (item2) {
                if (/[A-Z]+[0-9]+/.test(item2.index)) {
                    list3 = item2.items;

                    _.each(list3, function (item3) {
                        if (/[0-9]+/.test(item3.index)) {
                            if (!~constants.STATUS_TYPES.indexOf(item3.status)) {
                                message = '状态错误' + item3.status;
                                valid = false;
                            }

                            if (item3.status === 'UNCHECK' &&
                                (parseInt(item3.score, 10) >= 0 && !isNaN(parseInt(item3.score, 10)))) {
                                message = '状态与得分不一致' + item3.status + '/' + item3.score;
                                valid = false;
                            }

                            if ((item3.status === 'PASS' && parseInt(item3.score, 10) !== 0) ||
                                (item3.status === 'FAIL' && parseInt(item3.score, 10) === 0)) {
                                message = '状态与得分不一致' + item3.status + '/' + item3.score;
                                valid = false;
                            }
                        } else {
                            message = '标识错误' + item3.index;
                            valid = false;
                        }
                    });
                } else {
                    message = '标识错误' + item2.index;
                    valid = false;
                }
            });
        } else {
            message = '标识错误' + item1.index;
            valid = false;
        }
    });

    if (!valid) {
        return next({
            code: 103,
            message: "数据验证错误" + message 
        });
    }

    var options = {
        findOne: true,
        conditions: {   
            _id: table_id
        }
    };

    TableModel.findBy(options, function(err, root) {
        if (err) {
            return next(err);
        }

        var list1 = table.items,
            list2,
            list3,
            key,
            key1,
            key2,
            key3,
            ret = {};
        _.each(list1, function(item1) {
            list2 = item1.items;
            key1 = item1.index;
            _.each(list2, function(item2) {
                list3 = item2.items;
                key2 = item2.index;
                _.each(list3, function(item3) {
                    key3 = item3.index;
                    key = key1 + "-" + key2 + "-" + key3;

                    ret[key] = {
                        status: item3.status,
                        score: item3.score,
                        comments: item3.comments,
                        image_url: item3.image_url
                    };
                });
            });
        });

        list1 = root.items;
        _.each(list1, function(item1) {
            list2 = item1.items;
            key1 = item1.index;
            _.each(list2, function(item2) {
                list3 = item2.items;
                key2 = item2.index;
                _.each(list3, function(item3) {
                    key3 = item3.index;
                    key = key1 + "-" + key2 + "-" + key3;

                    _.extend(item3, ret[key]);
                });
            });
        });

        // Mixed类型需要标记修改过的path
        root.markModified('items');

        root.save(function (err) {
            if (err) {
                return next(err);
            }

            res.send({
                'status': 'success',
                'code': 0,
                'table': root
            });
        });
    });
};

exports.delete = function (req, res, next) {
    var table_id = validator.trim(req.params.table_id);
    var conditions = {   
        _id: table_id
    };

    TableModel.findOneAndRemove(conditions, function (err, table) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'table': table
        });
    });
};

exports.create = function (req, res, next) {
    var file = validator.trim(req.body.file);
    if (!file || /^[-_a-zA-Z0-9]+$/.test(file)) {
        return next({
            code: 101,
            message: '缺少参数'
        });
    }

    var table = new TableModel();
    var proto = require('../data/' + file + '.json');
    _.extend(table, proto);

    table.uuid = Date.now(); // TODO 替换更好的随机算法
    table.save(function(err, table) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'table': table
        });
    });
};
