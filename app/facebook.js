var request = require('request');

module.exports = function(app) {
	app.get('/facebook/bot/webhook', function(req, res) {
		if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    	console.log("Validating webhook");
    	res.status(200).send(req.query['hub.challenge']);
  	} else {
    	console.error("Failed validation. Make sure the validation tokens match.");
    	res.sendStatus(403);          
  	}
	});
}