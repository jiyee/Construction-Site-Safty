var _ = require('lodash');
var validator = require('validator');
var eventproxy = require('eventproxy');
var Table = require('../proxy/').Table;

exports.find = function (req, res, next) {
    return Table.find(function(err, tables) {
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

    return Table.findById(table_id, function(err, table) {
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
    table = JSON.parse(table);

    if (!table ||
        !table.items ||
        table.items.length === 0) {
        return next({
            code: 103,
            message: '数据错误'
        });
    } 

    var valid = true;
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
                            if (['UNCHECK', 'PASS', 'FAIL'].indexOf(item3.status) === -1) {
                                valid = false;
                            }

                            if (item3.status === 'UNCHECK' &&
                                item3.score != null) {
                                valid = false;
                            }

                            if ((item3.status === 'PASS' && item3.score != 0) ||
                                (item3.status === 'FAIL' && item3.score != 1)) {
                                valid = false;
                            }
                        } else {
                            valid = false;
                        }
                    });
                } else {
                    valid = false;
                }
            });
        } else {
            valid = false;
        }
    });

    if (!valid) {
        return next({
            code: 103,
            message: "数据验证错误"  
        });
    }

    return Table.findById(table_id, function(err, root) {
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
                        comments: item3.comments
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

    return Table.findById(table_id, function(err, table) {
        if (err) {
            return next(err);
        }

        table.remove();

        res.send({
            'status': 'success',
            'code': 0
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

    Table.newAndSave(file, function(err) {
        if (err) {
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'file': file
        });
    });

    console.log("/table/create => new and save.");
};
