var http = require('http');
var express = require('express');
var fs = require('fs');

var app = express();

var fortune = require('./lib/fortune.js');

// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// static content 
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/assets'));

// everyday I'm testing
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.set('port', process.env.PORT || 3000);


app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', { 
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/contact', function(req, res) {
    res.render('contact');
});



// custom 404 page
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port'));
});
