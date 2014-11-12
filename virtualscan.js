var http = require('http');
var express = require('express');
var fs = require('fs');

var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// static content - using bower_components
app.use(express.static(__dirname + '/bower_components'));

app.set('port', process.env.PORT || 3000);

// how do I shot fortune?
var fortunes = [
    'You will die painfully',
    'Pittsburgh has the most bridges of any city in the U.S.',
    'I just sneezed'
    ];

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', { fortune: randomFortune });
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
