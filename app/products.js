var SquareConnect = require('square-connect');
var request = require('request');
var Item = require('./model/item');

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

function saveItem(item) {
	var findItem = Item.findOne({_id: item._id});
	var itemSaved = findItem.then(function(dbItem) {
		if (dbItem) {
			return updateItemProperties(dbItem, item);
		} else {
			var newItem = new Item();
			return updateItemProperties(newItem, item);
		}
	});

	return itemSaved;
}

function getItems() {
	return Item.find({});
}

function updateItemProperties(dbItem, item) {
	dbItem.name = item.name;
	dbItem.categoryName = item.categoryName;
	dbItem.sku = item.sku;
	dbItem.minimumOrderQuantity = item.minimumOrderQuantity;
	dbItem.options = item.options;
	dbItem.description = item.description;
	dbItem.alcoholPercentage = item.alcoholPercentage;
	dbItem.bottleSize = item.bottleSize;
	dbItem.images = item.images;
	return dbItem.save();
}

module.exports = {
	getStoreLocations: getStoreLocations,
	getCatalog: getCatalog,
	saveItem: saveItem,
	getItems: getItems
}