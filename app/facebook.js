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
		text = text.replace(/ |,|\.|\!/g, '');
		actions.markRead();
		actions.setTyping(true);

		console.log('text');

		if (text == 'testing') {
			var response = 'Thank you for giving me life.';
			respond(response, reply, actions);
		} else if (text == 'hiciderbot') {
			bot.getProfile(payload.sender.id, function(err, profile) {
				respond('Hi ' + profile.first_name + '. My sole reason for existence is to serve you. What can I help you with?', reply, actions);
			});
		} else if (text == 'iamhardaf') {
			actions.setTyping(false);
			reply({
				text: 'Are you just happy to see me or do you have a secret code?',
				quick_replies: [{
					title: 'I have a code',
					content_type: 'text',
					playload: 'secretcode'
				}, {
					title: 'I\m just happy to see you.',
					content_type: 'text',
					playload: 'happy'
				}]
			});
		} 
		else {
			actions.setTyping(false);
		}
	});

	bot.setGetStartedButton('Hi I am CiderBot. Ask me anything and I\'ll do my best to help you.');

	function respond(message, reply, actions) {
		actions.setTyping(false);
		reply({ text: message});
	}

}