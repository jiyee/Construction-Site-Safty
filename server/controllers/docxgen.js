var validator = require('validator');
var eventproxy = require('eventproxy');
var fs = require('fs');
var path = require("path");
var DocxGen = require('docxtemplater');

exports.evaluation = function(req, res, next) {

    var docx = new DocxGen().loadFromFile(file);

    docx.setTags(data);
    docx.applyTags();
    docx.output();
};
