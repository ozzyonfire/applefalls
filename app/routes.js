module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('home');
	});

	app.get('/our-cider', function(req, res) {
		res.render('our-cider');
	});

	
}