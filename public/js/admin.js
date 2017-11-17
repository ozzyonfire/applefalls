var categories = [];
var itemList = [];
var theItem = {};
var theOption = {};

function setupNewReader(file) {
	var reader = new FileReader();
	reader.onload = function(e) {
		console.log('Sending file...');
		var buffer = e.target.result;
		socket.emit('saveProductImage', file.name, buffer);
	}
	reader.readAsBinaryString(file);
}

$(document).ready(function() {
	$('#addProduct').click(function() {
		populateProductModal(getDefaultItem());
		$('#editProductModal').modal();
	});

	$('#getSquareItems').click(function() {
		socket.emit('getSquareCatalog', 'item');
	});

	$('#saveProductButton').click(function() {
		saveItem();
		socket.emit('saveItem', theItem);
		$('#editProductModal').modal('hide');
	});

	$('#addOptionButton').click(function() {
		saveItem();
		$('#optionModal').modal();
		var option = {
			name: 'Regular',
			price: '7.50'
		};
		theItem.options.push(option);
		populateOptionModal(option);
	});

	$('#saveOptionButton').click(function() {
		saveOption();
		populateProductModal(theItem);
		$('#optionModal').modal('hide');
	});

	$('#deleteOptionButton').click(function() {
		theItem.options.splice($.inArray(theOption, theItem.options), 1);
		populateProductModal(theItem);
		$('#optionModal').modal('hide');
	});

	socket.emit('getSquareCategories');
	socket.emit('getItems');
});

socket.on('connect', () => {
	console.log(socket.id);
})

socket.on('saveItemFinished', function() {
	socket.emit('getItems');
});

socket.on('getItemsFinished', function(items) {
	$('#productTableBody').empty();
	console.log(items);
	items.forEach(function(item) {
		addProductToTable(item);
	});
});

socket.on('squareCatalogFinished', function(items) {
	console.log(items);
	$('#itemList').empty();

	items.forEach(function(item) {
		var button = $('<button class="list-group-item"></button>');
		var categoryName = '';
		categories.forEach(function(category) {
			if (item.item_data.category_id == category.id) {
				categoryName = category.category_data.name;
			}
		});
		item.item_data.categoryName = categoryName;
		button.text(item.item_data.name + ' - ' + categoryName);
		button.click(function() {
			var newItem = createItem(item);
			addProductToTable(newItem);
			$('#addItem').modal('hide');
		});

		$('#itemList').append(button);
	});

	$('#addItem').modal();
});

socket.on('squareCategoriesFinished', function(cats) {
	console.log(cats);
	// $('#productCategory').empty();
	// cats.forEach(function(category) {
	// 	var categoryName = category.category_data.name;
	// 	$('#productCategory').append($('<option></option>').prop('value', categoryName).text(categoryName));
	// });
	categories = cats;
});

function createItem(squareItem) {
	var item = {
		name: squareItem.item_data.name,
		categoryName: squareItem.item_data.categoryName,
		options: [],
		squareId: squareItem.id,
		squareItem: true,
		description: squareItem.item_data.description,
		alcoholPercentage: 6.9, // default
		bottleSize: 500, // default
		images: []
	}

	squareItem.item_data.variations.forEach(function(variation) {
		if (variation.item_variation_data.pricing_type == 'FIXED_PRICING') {
			var option = {
				name: variation.item_variation_data.name,
				squareId: variation.id,
				price: variation.item_variation_data.price_money.amount
			};
			item.options.push(option);
		}
	});

	return item;
}

function getDefaultItem() {
	var item = {
		name: 'New Item',
		categoryName: 'Cider',
		options: [{
			name: 'Regular',
			price: '0.00',
			minimumQuantity: 1
		}],
		description: 'Default item description',
		alcoholPercentage: '7',
		bottleSize: '500',
		images: ['/img/products/default.png']
	};
	return item;
}

function addProductToTable(item) {
	var row = $('<tr></tr>');

	var name = $('<td></td>');
	name.text(item.name);
	var category = $('<td></td>');
	category.text(item.categoryName);
	var variations = $('<td></td>');
	variations.text(item.options.length);

	row.append(name);
	row.append(category);
	row.append(variations);

	row.click(function() {
		$('#editProductModal').modal();
		populateProductModal(item);
	});

	$('#productTableBody').append(row);
}

function populateProductModal(item) {
	theItem = item;
	$('#productName').val(item.name);
	$('#productCategory').val(item.categoryName);
	$('#alcPercentage').val(item.alcoholPercentage);
	$('#bottleSize').val(item.bottleSize);
	$('#productDescription').val(item.description);

	$('#optionTableBody').empty();
	item.options.forEach(function(option) {
		var row = $('<tr></tr>');
		var nameCol = $('<<td></td>');
		var priceCol = $('<td></td>');
		var orderCol = $('<td></td>');

		nameCol.text(option.name);
		priceCol.text(option.price);
		orderCol.text(option.minimumQuantity);

		row.append(nameCol);
		row.append(priceCol);
		row.append(orderCol);

		row.click(function() {
			saveItem();
			$('#optionModal').modal();
			populateOptionModal(option);
		});

		$('#optionTableBody').append(row);
	});

	var images = '';
	item.images.forEach(function(image) { // todo
		images += image + '\n';
	});
	images = images.substring(0, images.length-1);
	$('#productImages').val(images);
}

function populateOptionModal(option) {
	theOption = option;
	$('#addOptionName').val(option.name);
	$('#addOptionPrice').val(option.price);
	$('#optionMinimumQuantity').val(option.minimumQuantity);
}

function saveOption() {
	theOption.name = $('#addOptionName').val();
	theOption.price = $('#addOptionPrice').val();
	theOption.minimumQuantity = $('#optionMinimumQuantity').val();
}

function saveItem() {
	theItem.name = $('#productName').val();
	theItem.Category = $('#productCategory').val();
	theItem.alcoholPercentage = $('#alcPercentage').val();
	theItem.bottleSize = $('#bottleSize').val();
	theItem.description = $('#productDescription').val();

	var images = [];
	var imageString = $('#productImages').val();
	images = imageString.split('\n');
	theItem.images = images;

	// the options should already be saved
}