var SquareConnect = require('square-connect');
var request = require('request');
var Item = require('./model/item');
var Category = require('./model/category');
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

function saveCategory(category) {
	var findCat = Category.findOne({_id: category._id});
	return findCat.then(function(dbCategory) {
		if (dbCategory) {
			return updateCategoryProperties(dbCategory, category);
		} else {
			var newCategory = new Category();
			return updateCategoryProperties(newCategory, category);
		}
	})
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

function checkoutViaSquare(sessionID, isShipping, callback) {
	var findCart = Cart.findOne({sessionID: sessionID});
	findCart.then(function(cart) {
		var checkout = {
			redirect_uri: 'https://applefallscider.ca/thanks',
			idempotency_key: uuidv1(),
			ask_for_shipping_address: isShipping,
			merchant_support_email: 'info@applefallscider.ca',
			order: cart.order
		};

		var options = getOptions('locations/'+process.env.SQ_LOCATION+'/checkouts', 'POST');
		options.body = checkout;
		options.json = true;

		request(options, function(err, response, body) {
			console.log(body);
			callback(body.checkout.checkout_page_url);
		});
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

function updateCategoryProperties(dbCategory, category) {
	console.log(category);
	dbCategory.name = category.name;
	dbCategory.minimumOrder = parseInt(category.minimumOrder);
	console.log(dbCategory);
	return dbCategory.save();
}

function getCategories() {
	return Category.find({});
}

module.exports = {
	getStoreLocations: getStoreLocations,
	getCatalog: getCatalog,
	saveItem: saveItem,
	getItems: getItems,
	getCart: getCart,
	addItemToCart: addItemToCart,
	saveCart: saveCart,
	checkoutViaSquare: checkoutViaSquare,
	saveCategory: saveCategory,
	getCategories: getCategories
}