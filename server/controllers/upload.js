var validator = require('validator');
var eventproxy = require('eventproxy');
var fs = require('fs');
var formidable = require('formidable');

exports.image = function(req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        console.log('start form');
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }

        //logs the file information
        console.log(JSON.stringify(files));

        console.log(files.file);

        console.log('end');

        fs.rename(files.file.path, "/images/a.jpg", function(err) {
            if (err) {
                fs.unlink("/images/a.jpg");
                fs.rename(files.file.path, "/images/a.jpg");
            }
        });

        res.send({
            imageURL: '/images/a.jpg'
        });
    });

    form.onPart = function(part) {
        part.addListener('data', function() {
            console.log('ondata');
        });
    };
};
