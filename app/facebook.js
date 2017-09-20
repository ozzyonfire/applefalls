var request = require('request');
var Bot = require('messenger-bot');
var Code = require('./model/code');

var secretCodeMessageId = '';

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
		console.log(payload);
		var text = payload.message.text;
		var quickReply = payload.message.quick_reply;
		text = text.toLowerCase();
		text = text.replace(/ |,|\.|\!/g, '');
		actions.markRead();
		actions.setTyping(true);

		console.log(text);
		console.log(secretCodeMessageId);

		if (payload.mid == secretCodeMessageId) {
			// this is the reply from the secret message
			// verify code

			reply({
				text: 'Amazing!'
			});
		}

		if (quickReply) {
			console.log('quick reply');
			console.log(quickReply.payload);
			if (quickReply.payload == 'secretcode') {
				reply({
					text: 'Enter your code now.',
					metadata: 'secretcodeentry'
				}, function(err, info) {
					if (err) {
						console.log(err);
					} else {
						secretCodeMessageId = info.message_id;
					}
				});
			} else if (quickReply.payload == 'happy') {
				reply({
					text: 'Me too :)'
				});
			}
		}

		if (text == 'testing') {
			var response = 'Thank you for giving me life.';
			respond(response, reply, actions);
		} else if (text == 'hiciderbot') {
			bot.getProfile(payload.sender.id, function(err, profile) {
				respond('Hi ' + profile.first_name + '. My sole reason for existence is to serve you. What can I help you with?', reply, actions);
			});
		} else if (text == 'iamhardaf') {
			actions.setTyping(false);
			console.log('trying to send a quick reply');
			bot.sendMessage(payload.sender.id, {
				text: 'Are you just happy to see me or do you have a secret code?',
				quick_replies: [{
					title: 'I have a code',
					content_type: 'text',
					payload: 'secretcode'
				}, {
					title: 'just happy ',
					content_type: 'text',
					payload: 'happy'
				}]
			}, function(err, response) {
				console.log(err);
				console.log(response);
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