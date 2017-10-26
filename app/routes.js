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

	app.get('/blog', function(req, res) {
		res.render('blog');
	});

	app.get('/create', function(req, res) {
		res.render('create');
	});

	app.get('/privacy', function(req, res) {
		res.render('privacy');
	});

	app.get('/calculator', function(req, res) {
		res.render('calculator');
	});
}