var validator = require('validator');
var eventproxy = require('eventproxy');
var Table = require('../proxy/').Table;

exports.find = function(req, res, next) {
    return Table.find(function(err, table) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'table': table
        });
    });
};

exports.findById = function(req, res, next) {
    var table_id = validator.trim(req.params.table_id);

    return Table.findById(table_id, function(err, table) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({
            'status': 'success',
            'code': 0,
            'table': table
        });
    });
};

exports.create = function(req, res, next) {
    var file = validator.trim(req.body.file);

    Table.newAndSave(file, function(err) {
        if (err) {
            console.log('error: ', err);
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
