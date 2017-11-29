var request = require('request');

function subscribe(email) {
	console.log(email);
	var options = {
		method: 'POST',
		url: 'https://us13.api.mailchimp.com/3.0/lists/'+process.env.MC_CHRISTMAS_LIST,
		headers: {
			'content-type': 'application/json',
		},
		auth: {
			user: 'applefalls',
			pass: process.env.MC_API_KEY
		},
		json: true,
		body: {
			members: [{
				email_address: email,
				status: 'subscribed'
			}],
			update_existing: true
		}
	};

	request(options, (err, response, body) => {
		console.log(body);
	});
}

module.exports = {
	subscribe: subscribe
}