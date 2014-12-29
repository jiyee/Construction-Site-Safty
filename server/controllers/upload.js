var validator = require('validator');
var eventproxy = require('eventproxy');
var fs = require('fs');
var path = require("path");
var formidable = require('formidable');

exports.upload = function(req, res, next) {
    var form = new formidable.IncomingForm();

    form.uploadDir = './public/upload/';

    var fileName;
    form.on('file', function(field, file) {
            fileName = file.name;
            fs.rename(file.path, form.uploadDir + "/" + file.name);
        })
        .on('error', function(err) {
            next(err);
        })
        .on('aborted', function(err) {})
        .on('end', function() {
            res.send({
                "status": 200,
                'code': 0,
                "url": '/upload/' + fileName
            });
        });

    form.parse(req, function() {});
};