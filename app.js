var sslRedirect = require('heroku-ssl-redirect');
var express = require('express');
var routes = require('./app/routes');
var socketEvents = require('./app/socketEvents');
var app = express();
app.set('view engine', 'pug');

// enable ssl redirect
app.use(sslRedirect());

app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-wysiwyg/js/'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-notify/'));

var server = app.listen(process.env.PORT || 8888, function() {
	console.log('Apple Falls Website Server');
});

var io = require('socket.io')(server);

routes(app);
socketEvents(io);