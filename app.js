
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

//freemarker
var Freemarker = require('freemarker.js');
var fm = new Freemarker({
  viewRoot: __dirname +'/views',
  options: {
    /** for fmpp */
  }
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');//可以不需要
app.set('view engine', fm);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
