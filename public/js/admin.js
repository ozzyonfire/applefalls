var socket = io();
var categories = [];
var itemList = [];

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
		$('#editProductModal').modal();
	});

	$('#getSquareItems').click(function() {
		socket.emit('getSquareCatalog', 'item');
	});

	$('#saveProductButton').click(function() {
		var files = $('#productImages')[0].files;
		for(var i = 0; i < files.length; i++) {
			setupNewReader(files[i]);
		}
	});

	socket.emit('getSquareCategories');
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
	$('#productCategory').empty();
	cats.forEach(function(category) {
		var categoryName = category.category_data.name;
		$('#productCategory').append($('<option></option>').prop('value', categoryName).text(categoryName));
	});
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
	$('#productName').val(item.name);
	$('#productCategory').val(item.categoryName);
	$('#alcPercentage').val(item.alcoholPercentage);
	$('#bottleSize').val(item.bottleSize);
	$('#productDescription').val(item.description);

	$('#productOptions').empty();
	item.options.forEach(function(option) {
		var row = $('<div class="row"></row>');
		var nameCol = $('<div class="col-lg-5"></div>');
		var priceCol = $('<div class="col-lg-5"></div>');
		var deleteCol = $('<div class="col-lg-2"></div>');

		nameCol.append($('<label>Name</label>'));
		nameCol.append($('<input type="text">').val(option.name).addClass('form-control'));

		priceCol.append($('<label>Price</label>'));
		priceCol.append($('<input type="number">').val(option.price).addClass('form-control'));

		row.append(nameCol);
		row.append(priceCol);
		row.append(deleteCol);

		$('#productOptions').append(row);
	});

	item.images.forEach(function(image) { // todo
		console.log(image.name);
	});
}