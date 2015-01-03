var mongoose = require('mongoose');
var settings = require('../settings');

var options = {
    server: {
        auto_reconnect: true,
        poolSize: 10
    }
};

mongoose.connect("mongodb://localhost/" + settings.db, options, function(err) {
    if (err) {
        console.error('connect to %s error: ', settings.db, err.message);
        process.exit(1);
    } else {
        console.log('connect to %s server.', settings.db);
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function callback() {
    console.log('mongoose open success');
});

// mongoose.set('debug', true);

// include models
require('./user');
require('./unit');
require('./project');
require('./segment');
require('./table');
require('./check');
require('./evaluation');
require('./capture');
require('./gps');

// retrieve models
exports.UserModel = mongoose.model('User');
exports.UnitModel = mongoose.model('Unit');
exports.ProjectModel = mongoose.model('Project');
exports.SegmentModel = mongoose.model('Segment');
exports.TableModel = mongoose.model('Table');
exports.CheckModel = mongoose.model('Check');
exports.EvaluationModel = mongoose.model('Evaluation');
exports.CaptureModel = mongoose.model('Capture');
exports.GpsModel = mongoose.model('Gps');
