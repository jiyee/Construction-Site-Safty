var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var settings = require('./settings');

var app = express();
var server;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'css',
    key: 'sid',
    store: new MongoStore({
        db: 'sessions'
    }),
    cookie : {
        httpOnly : false,
    }
    // resave: true,
    // saveUninitialized: true
}));

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://10.171.40.8:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// production error handler
app.use(function(err, req, res, next) {
    res.status(200);
    res.send({
        code: err.code,
        message: err.message,
        error: err
    });
});


app.set('port', process.env.PORT || 3000);
server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
