var request = require('request');
var Bot = require('messenger-bot');

module.exports = function(app) {

	var bot = new Bot({
		token: process.env.PAGE_ACCESS_TOKEN,
		verify: process.env.VERIFY_TOKEN
	});

	app.get('/facebook/bot/webhook', function(req, res) {
		return bot._verify(req, res);
	});

	app.post('/facebook/bot/webhook', function(req, res) {
		bot._handlMessage(req.body);
		res.end(JSON.stringify({status: 'ok'}));
	});
}