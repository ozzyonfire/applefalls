var Item = require('./model/item');

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

	app.get('/news', function(req, res) {
		res.render('news');
	});

	app.get('/find-us', function(req, res) {
		res.render('find-us');
	});

	app.get('/store', function(req, res) {
		var findCiders = Item.find({categoryName: 'Cider'});
		findCiders.then(function(ciders) {
			res.render('store', {
				ciders: ciders
			});
		});
	});

	app.get('/admin', function(req, res) {
		res.render('admin');
	});

	app.get('/test', function(req, res) {
		res.render('test');
	});
}