var request = require('request');
var Bot = require('messenger-bot');

module.exports = function(app) {

	var bot = new Bot({
		token: process.env.PAGE_ACCESS_TOKEN,
		verify: process.env.VERIFY_TOKEN
	});

	app.get('/facebook/webhook', function(req, res) {
		console.log('Verifying webhook');
		return bot._verify(req, res);
	});

	app.post('/facebook/webhook', function(req, res) {
		bot._handlMessage(req.body);
		res.end(JSON.stringify({status: 'ok'}));
	});
}