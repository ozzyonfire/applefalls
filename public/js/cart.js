var theCategories = [];
var theCart = {};

$(document).ready(function() {
	socket.emit('getCart');
	socket.emit('getCategories');

	$('#cartTooltip').tooltip();

	$('#shoppingCartIcon').click(function(e) {
		e.preventDefault();
		$('#shoppingCartModal').modal();
	});

	$('#closeShoppingCart').click(function(e) {
		$('#shoppingCartModal').modal('hide');
		socket.emit('getCart');
	});

	$('#checkoutButton').click(function() {
		$('#shoppingCartModal').modal('hide');
		$('#shippingModal').modal();
	});

	$('#continueCheckout').click(() => {
		socket.emit('checkout', true);
	});

	$('#legalAge').change(() => {
		validateCheckout(theCart.line_items);
	});

	$('#checkoutButton').addClass('disabled');
	$('#checkoutButton').attr('disabled', 'disabled');
});

socket.on('getCartFinished', function(cart) {
	console.log(cart);
	theCart = cart;
	updateShoppingCart(cart);
});

socket.on('getCategoriesFinished', function(categories) {
	theCategories = categories;
	validateCheckout(theCart.line_items);
});

socket.on('checkoutURL', function(url) {
	window.location.href = url;
});

function updateShoppingCart(cart) {
	$('#cartBadge').text(cart.line_items.length);
	populateShoppingCartModal(cart);
	calculateCartSubtotal(cart);
	validateCheckout(cart.line_items);
}

function populateShoppingCartModal(cart) {
	$('#shoppingCartModalBody').empty();

	if (cart.line_items.length > 0) {
		$('#shoppingCartModalBody').append(getLineRow());
		cart.line_items.forEach(function(lineItem) {
			var row = $('<div class="row"></div>');

			var nameCol = $('<div class="col-lg-4"></div>');
			var optionCol = $('<div class="col-lg-3"></div>');
			var quantityCol = $('<div class="col-lg-2"></div>');
			var subtotalCol = $('<div class="col-lg-3"></div>');

			nameCol.text(lineItem.name);
			optionCol.text(lineItem.variation_name);
			var quantityInput = $('<input type="number" class="form-control" min="1">');
			quantityInput.val(lineItem.quantity);
			var base_price = lineItem.base_price_money.amount / 100;
			var subtotal = base_price * lineItem.quantity;
			subtotalCol.text('$'+subtotal.toFixed(2));

			quantityInput.on('input change', function() {
				lineItem.quantity = quantityInput.val();
				socket.emit('saveCart', cart);
				subtotal = base_price * lineItem.quantity;
				subtotalCol.text('$'+subtotal.toFixed(2));
				calculateCartSubtotal(cart);
				validateCheckout(cart.line_items);
			});

			quantityCol.append(quantityInput);

			row.append(nameCol);
			row.append(optionCol);
			row.append(quantityCol);
			row.append(subtotalCol);

			$('#shoppingCartModalBody').append(row);
			$('#shoppingCartModalBody').append(getLineRow());
		});
	} else {
		var row = $('<div class="row"></div>');
		var col = $('<div class="col-lg-12"></div>');
		col.text('You have no items in your cart.');
		row.append(col);
		$('#shoppingCartModalBody').append(row);
	}
}

function getLineRow() {
	var lineRow = $('<div class="row"></div>');
	lineRow.append($('<div class="col-lg-12"><hr class="thin-line"></div>'));
	return lineRow;
}

function calculateCartSubtotal(cart) {
	var subtotal = 0;
	cart.line_items.forEach(function(lineItem) {
		var lineTotal = lineItem.quantity * lineItem.base_price_money.amount / 100;
		subtotal += lineTotal;
	});

	$('#subtotalModal').text('$'+subtotal.toFixed(2));
}

function validateCheckout(items) {
	var message = 'Looks good!';
	var legalAgeRequired = false;
	theCategories.forEach((category) => {
		category.cartTotal = 0;
		category.containsItems = false;
		if (category.legalAgeRequired == true) {
			legalAgeRequired = true;
		}
	});

	items.forEach((item) => {
		theCategories.forEach((category) => {
			if (item.categoryName == category.name) {
				category.cartTotal += parseInt(item.quantity);
				category.containsItems = true;
			}
		});
	});

	var validCart = true;
	if (items.length == 0) {
		validCart = false;
		message = 'No items in cart.'
	} else {
		theCategories.forEach((category) => {
			if (category.minimumOrder > category.cartTotal && category.containsItems) {
				validCart = false;
				message = 'Minimum order quantity not met.';
			}
		});
	}

	console.log(theCategories);

	if (!$('#legalAge').is(':checked') && legalAgeRequired) {
		validCart = false;
		message = 'You must be of legal age to purchase an item in your cart.';
	}

	$('#cartTooltip').attr('data-original-title', message).tooltip('fixTitle');
	if (validCart == true) {
		$('#checkoutButton').removeClass('disabled');
		$('#checkoutButton').removeAttr('disabled');
	} else {
		$('#checkoutButton').addClass('disabled');
		$('#checkoutButton').attr('disabled', 'disabled');
	}
}