var Code = require('./model/code');
var products = require('./products');
var mailchimp = require('./mailchimp');
var fs = require('fs');
var path = require('path');
var alphabet = 'abcdefghijklmnopqrstuvwxyz';

module.exports = function(io) {
	io.on('connection', function(socket) {
		var q1, q2, q3, q4, q5;

		socket.on('validate', function(name, value) {
			value = value.toLowerCase();

			switch(name) {
				case 'ciderQ':
					q1 = value == 'premiere';
					if (q1)
						socket.emit('q1_correct');
					else
						socket.emit('q1_incorrect');
					break;
				case 'instaQ':
					q2 = value == 'mac';
					if (q2)
						socket.emit('q2_correct');
					else
						socket.emit('q2_incorrect');
					break;
				case 'houseQ':
					q3 = value == 'amelia' || value == 'amelia\'s';
					if (q3)
						socket.emit('q3_correct');
					else
						socket.emit('q3_incorrect');
					break;
				case 'tankQ':
					q4 = value == 'tina';
					if (q4) 
						socket.emit('q4_correct');
					else
						socket.emit('q4_incorrect');
					break;
				case 'riddleQ':
					value = value.replace(/,| /gi, '');
					q5 = value == 'johncolinmattmaddyamelia';
					if (q5)
						socket.emit('q5_correct');
					else
						socket.emit('q5_incorrect');
					break;
				default:
					console.log('defaulted');
			}

			if (q1 && q2 && q3 && q4 && q5) {
				generateUniqueCode(function(code) {
					var message = 'I am hard AF';
					socket.emit('allQuestionsCorrect', message, code.code);
				});
			}
		});
		
		socket.on('addProduct', function() {
			products.getStoreLocations();
		});

		socket.on('getSquareCatalog', function(types) {
			products.getCatalog(types, function(catalogItems) {
				socket.emit('squareCatalogFinished', catalogItems);
			});
		});

		socket.on('getSquareCategories', function() {
			products.getCatalog('category', function(categories) {
				socket.emit('squareCategoriesFinished', categories);
			});
		});

		socket.on('saveProductImage', function(name, buffer) {
			var fileName = path.resolve(__dirname + '/../public/img/products/'+name);
			fs.open(fileName, 'a', 0755, function(err, fd) {
				if (err) {
					throw err;
				}
				fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
					fs.close(fd, function() {
						console.log('File saved successfully');
					});
				});
			});
		});

		socket.on('saveItem', function(item) {
			var saveItem = products.saveItem(item);
			saveItem.then(function(newItem) {
				socket.emit('saveItemFinished');
			});
		});

		socket.on('getItems', function() {
			var itemsFinished = products.getItems();
			itemsFinished.then(function(items) {
				socket.emit('getItemsFinished', items);
			});
		});

		socket.on('getCart', function() {
			var getCart = products.getCart(socket.request.sessionID);
			getCart.then(function(order) {
				socket.emit('getCartFinished', order);
			});
		});

		socket.on('addItemToCart', function(lineItem) {
			var saveCart = products.addItemToCart(lineItem, socket.request.sessionID);
			saveCart.then(function(cart) {
				socket.emit('addItemToCartFinished', cart.order);
			});
		});

		socket.on('saveCart', function(order) {
			var saveCartPromise = products.saveCart(socket.request.sessionID, order);
		});

		socket.on('checkout', function(isShipped) {
			products.checkoutViaSquare(socket.request.sessionID, isShipped, function(url) {
				socket.emit('checkoutURL', url);
			});
		});

		socket.on('saveCategory', function(category) {
			var saveCat = products.saveCategory(category);
			saveCat.then(function(cat) {
				console.log('category saved');
			});
		});

		socket.on('getCategories', function() {
			var getCats = products.getCategories();
			getCats.then(function(cats) {
				socket.emit('getCategoriesFinished', cats);
			});
		});

		socket.on('subscribeToOffer', function(email) {
			mailchimp.subscribe(email);
		});
	});
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function generateUniqueCode(callback) {
	var code = generateCode();
	console.log(code);

	Code.findOne({code: code}, function(err, theCode) {
		if (err) {
			console.log('error');
			console.log(err);
		} else {
			console.log('no error');
			if (theCode) {
				generateUniqueCode(callback); // this code already exists
			} else {
				var newCode = new Code();
				newCode.code = code;
				newCode.used = false;
				newCode.save(function(err, savedCode) {
					if (err) {
						console.log(err);
					} else {
						callback(savedCode);
					}
				});
			}
		}
	});
}

function generateCode() {
	var code = alphabet.charAt(getRandomInt(0, 25));
	code += alphabet.charAt(getRandomInt(0, 25));
	code += alphabet.charAt(getRandomInt(0, 25));
	code += alphabet.charAt(getRandomInt(0, 25));
	code = code.toUpperCase();
	return code;
}