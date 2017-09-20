var request = require('request');
var Bot = require('messenger-bot');
var Code = require('./model/code');

var readyForCode = false;

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

		if (readyForCode && text.length == 4) {
			var code = text.toUpperCase();
			Code.findOne({code: code}, function(err, theCode) {
				if (err) {
					console.log(err);
				} else {
					if (theCode.used == false) {
						bot.getProfile(payload.sender.id, function(err, profile) {
							theCode.used = true;
							theCode.recipient = profile;
							theCode.name = profile.first_name;
							theCode.save();
							reply({
								text: 'Congrats! You are an official super fan of '+
									'Apple Falls Cider Co. To thank you for your loyalty '+ 
									'we will give you a free T-shirt and enter you into a '+
									'draw to win a grand prize!'
							});
						});
					} else if (theCode.used == true) {
						reply({
							text: 'I\'m sorry. Someone has already used that code.'
						});
					} else {
						reply({
							text: 'That doesn\'t look like a real code to me... How did you get here?'
						});
					}
				}
			});
			readyForCode = false;
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
						readyForCode = true;
					}
				});
			} else if (quickReply.payload == 'happy') {
				reply({
					text: 'Me too :)'
				});
				readyForCode = false;
			}
		} else {
			readyForCode = false;
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