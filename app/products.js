var SquareConnect = require('square-connect');
var request = require('request');
var Item = require('./model/item');
var Cart = require('./model/cart');
var uuidv1 = require('uuid/v1');

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

function getCart(sessionID) {
	var findCart = Cart.findOne({sessionID: sessionID});
	return findCart.then(function(cart) {
		if (cart) {
			console.log('existing cart');
			return cart.order;
		} else {
			console.log('new cart');
			var saveCart = getNewCart(sessionID);
			return saveCart.then(function(newCart) {
				return newCart.order;
			});
		}
	});
}

function getNewCart(sessionID) {
	var newCart = new Cart();
	newCart.sessionID = sessionID;
	var order = {
		idempotency_key: uuidv1(),
		reference_id: sessionID,
		line_items: []
	};
	newCart.order = order;
	return newCart.save();
}

function addItemToCart(lineItem, sessionID) {
	var findCart = Cart.findOne({sessionID: sessionID});
	return findCart.then(function(cart) {
		if (cart) {
			var duplicate = false;
			cart.order.line_items.forEach(function(line_item) {
				if (line_item.note == lineItem.note) {
					duplicate = true;
					var oldQuantity = parseInt(line_item.quantity);
					line_item.quantity = oldQuantity + parseInt(lineItem.quantity);
				}
			});
			if (duplicate == false) {
				cart.order.line_items.push(lineItem);
			}
			cart.markModified('order');
			return cart.save();
		} else {
			console.log('No Cart Found');
			var newCartPromise = getNewCart(sessionID);
			return newCartPromise.then(function(newCart) {
				newCart.order.line_items.push(lineItem);
				newCart.markModified('order');
				return newCart.save();
			});
		}
	});
}

function saveCart(sessionID, order) {
	var findCart = Cart.findOne({sessionID: sessionID});
	findCart.then(function(cart) {
		if (cart) {
			var line_items = [];
			order.line_items.forEach(function(lineItem) {
				if (lineItem.quantity > 0) {
					line_items.push(lineItem);
				}
			});

			cart.order.line_items = line_items;
			cart.markModified('order');
			cart.save();
		} else {
			console.log('No cart found.');
		}
	});
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
	getItems: getItems,
	getCart: getCart,
	addItemToCart: addItemToCart,
	saveCart: saveCart
}