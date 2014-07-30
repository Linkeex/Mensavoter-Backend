
/**
 * Module dependencies.
 */

var express = require('express');
var launchCtrl = require('./controllers/launchCtrl.js');
var days = require('./routes/days.js');
var util = require('./controllers/utilCtrl.js');
var votes = require('./routes/votes.js');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

launchCtrl.init();
util.initCron();

app.get('/days/:date', days.getDay);

app.get('/days/:date/meals/:meal/up', util.checkIP, votes.upvote);
app.get('/days/:date/meals/:meal/down', util.checkIP, votes.downvote);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
