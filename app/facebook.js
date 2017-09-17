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
		text = text.replace(/ |,|./g, '');
		actions.markRead();
		actions.setTyping(true);

		if (text == 'testing') {
			respond('Thank you for giving me life.');
		} else if (text == 'hiciderbot') {
			bot.getProfile(payload.sender.id, function(err, profile) {
				respond('Hi ' + profile.first_name + '. My sole reason for existence is to serve you. What can I help you with?')
			});
		} else {
			actions.setTyping(false);
		}
	});

	bot.setGetStartedButton('Hi I am CiderBot. Ask me anything and I\'ll do my best to help you.');

	function respond(message, reply, actions) {
		actions.setTyping(false);
		reply({ text: message});
	}


}