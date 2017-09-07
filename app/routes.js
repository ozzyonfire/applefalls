module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('home');
	});

	app.get('/our-cider', function(req, res) {
		res.render('our-cider');
	});

	app.get('/events', function(req, res) {
		res.render('events');
	});

	app.get('/our-story', function(req, res) {
		res.render('our-story');
	});

	app.get('/contact', function(req, res) {
		res.render('contact');
	});
}