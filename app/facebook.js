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
		bot._handleMessage(req.body);
		res.end(JSON.stringify({status: 'ok'}));
	});

	bot.on('message', function(payload, reply, actions) {
		var text = payload.message.text;
		text = text.toLowerCase();

		if (text == 'testing') {
			actions.setTyping(true);
			setTimeout(reply({
				text: 'Thank you for giving me life.'
			}), 1000);
		} else if (text == 'hi ciderbot') {
			bot.getProfile(payload.sender.id, function(err, profile) {
				actions.setTyping(true);
				setTimeout(reply({
					text: 'Hi ' + profile.first_name + '. I exist to serve you. What can I help you with today?'
				}), 2000);
			});
		}
	});
}