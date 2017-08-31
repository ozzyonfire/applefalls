var express = require('express');
var routes = require('./app/routes');
var app = express();
app.set('view engine', 'pug');

app.use(express.static('public'));
var server = app.listen(process.env.PORT || 8888, function() {
	console.log('Apple Falls Website Server');
});

var io = require('socket.io')(server);

routes(app);