var currentOption = {};
var theItem = {};

$(document).ready(function() {
	$('#quantityInput').on('input', function() {
		calculateSubtotal();
	});

	$('#quantityInput').on('change', function() {
		calculateSubtotal();
	});

	$('#addToCartButton').click(function() {
		$('#itemModal').modal('hide');
		var lineItem = {
			note: theItem._id, // use this as an identifier so we don't add duplicates
			name: theItem.name,
			quantity: $('#quantityInput').val(),
			categoryName: theItem.categoryName,
			base_price_money: {
				amount: currentOption.price * 100,
				currency: 'CAD'
			},
			variation_name: currentOption.name
		};
		socket.emit('addItemToCart', lineItem);
	});
});

socket.on('addItemToCartFinished', function(cart) {
	console.log(cart);
	updateShoppingCart(cart);
});

function populateListingModal(item) {
	theItem = item;
	$('#itemNameTitle').text(item.name);
	$('#itemDescription').text(item.description);
	$('#alcoholPercentage').text(item.alcoholPercentage + '%');
	$('#bottleSize').text(item.bottleSize + ' ml');

	$('#carouselIndicators').empty();
	$('#carouselItems').empty();

	for (var i = 0; i < item.images.length; i++) {
		var indicator = $('<li></li>');
		indicator.attr('data-target', '#imageCarousel');
		indicator.attr('data-slide-to', i);

		var carouselItem = $('<div class="item"></div>');
		var image = $('<img>');
		image.addClass('img-rounded img-responsive center-block');
		image.attr('src', item.images[i]);

		if (i == 0) {
			indicator.addClass('active');
			carouselItem.addClass('active');
		}

		carouselItem.append(image);
		$('#carouselIndicators').append(indicator);
		$('#carouselItems').append(carouselItem);
	}

	$('#itemOptions').empty();
	item.options.forEach(function(itemOption) {
		var option = $('<option></option>');
		option.attr('value', itemOption.name);
		option.text(itemOption.name + ' - $' + itemOption.price.toFixed(2));

		$('#itemOptions').change(function() {
			console.log('changed');
			$('#quantityInput').attr('min', option.minimumQuantity);
			$('#quantityInput').val(option.minimumQuantity);
			currentOption = itemOption;
			calculateSubtotal();
		});

		$('#itemOptions').append(option);
	});

	$('#quantityInput').attr('min', item.options[0].minimumQuantity);
	$('#quantityInput').val(item.options[0].minimumQuantity);
	currentOption = item.options[0];
	calculateSubtotal();
}

function calculateSubtotal() {
	var quantity = $('#quantityInput').val();
	var price = currentOption.price;
	var subtotal = quantity * price;
	$('#itemSubtotal').text('$' + subtotal.toFixed(2));
}