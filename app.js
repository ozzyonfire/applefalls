require('dotenv').config();
var sslRedirect = require('heroku-ssl-redirect');
var express = require('express');
var session = require('express-session');
var routes = require('./app/routes');
var facebook = require('./app/facebook');
var socketEvents = require('./app/socketEvents');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.set('view engine', 'pug');

// enable ssl redirect
app.use(sslRedirect());

// prepare DB
var uriString = process.env.MONGODB_URI || 
                process.env.MONGOHQ_URL ||
                'mongodb://localhost/af';

mongoose.connect(uriString, function (err, res) {
  if (err) {
    console.log('Error connecting to: ' + uriString + '. ' + err);
  } else {
    console.log('Successfully connected to: ' + uriString);
  }
});

// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

var sessionMiddleware = session({
	secret: 'an apple a day',
	cookie: {
		maxAge: 7 * 60 * 60 * 1000
	}
});

app.use(sessionMiddleware);

app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-wysiwyg/js/'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-notify/'));

var server = app.listen(process.env.PORT || 8888, function() {
	console.log('Apple Falls Website Server');
});

var io = require('socket.io')(server);

io.use(function(socket, next) {
	sessionMiddleware(socket.request, socket.request.res, next);
});

routes(app);
facebook(app);
socketEvents(io);