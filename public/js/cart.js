$(document).ready(function() {
	socket.emit('getCart');

	$('#shoppingCartIcon').click(function(e) {
		e.preventDefault();
		$('#shoppingCartModal').modal();
	});

	$('#closeShoppingCart').click(function(e) {
		$('#shoppingCartModal').modal('hide');
		socket.emit('getCart');
	});
});

socket.on('getCartFinished', function(cart) {
	console.log(cart);
	console.log('got the cart');
	updateShoppingCart(cart);
});

function updateShoppingCart(cart) {
	$('#cartBadge').text(cart.line_items.length);
	populateShoppingCartModal(cart);
	calculateCartSubtotal(cart);
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
			var quantityInput = $('<input type="number" class="form-control">');
			quantityInput.val(lineItem.quantity);
			var base_price = lineItem.base_price_money.amount;
			var subtotal = base_price * lineItem.quantity;
			subtotalCol.text('$'+subtotal.toFixed(2));

			quantityInput.on('input change', function() {
				lineItem.quantity = quantityInput.val();
				socket.emit('saveCart', cart);
				subtotal = base_price * lineItem.quantity;
				subtotalCol.text('$'+subtotal.toFixed(2));
				calculateCartSubtotal(cart);
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
		var col = $('<div class="col-lg-12></div>');
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
		var lineTotal = lineItem.quantity * lineItem.base_price_money.amount;
		subtotal += lineTotal;
	});

	$('#subtotalModal').text('$'+subtotal.toFixed(2));
}