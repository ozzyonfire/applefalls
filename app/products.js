var SquareConnect = require('square-connect');
var request = require('request');


function getStoreLocations() {
	request(getOptions('locations','GET'), genericCallback);
}

function getCatalog(types, callback) {
	var options = getOptions('catalog/list', 'GET', {types:types});
	request(options, function(err, response, body) {
		var jsonBody = JSON.parse(body);
		callback(jsonBody.objects);
	});
}

function getOptions(endpoint, method, query) {
	var options = {
		url: 'https://connect.squareup.com/v2/'+endpoint,
		method: method,
		headers: {
			Authorization: 'Bearer ' + process.env.SQ_ACCESS_TOKEN,
			Accept: 'application/json'
		},
		qs: query
	};
	
	return options;
}

function genericCallback(err, response, body) {
	var jsonBody = JSON.parse(body);
	console.log(jsonBody);
}

module.exports = {
	getStoreLocations: getStoreLocations,
	getCatalog: getCatalog
}