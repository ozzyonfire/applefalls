var items = [];

$(document).ready(function() {
	$('.taxInput').on('input', function() {
		calculateTaxTable();
	});

	$('#saveItemButton').click(function() {
		addItem();
		$('#itemModal').modal('hide');
	});

	$('.calcSales').on('input', function() {
		calculateTotalSales();
	});

	$('.calcVolume').on('input', function() {
		calculateTotalVolume();
	});
});

function calculateTotalSales() {
	var price = $('#itemPrice').val();
	var bottlesSold = $('#bottlesSold').val();
	var sales = price * bottlesSold;
	$('#totalSales').val(sales.toFixed(2));
	calculateTaxTable();
}

function calculateTotalVolume() {
	var bottleSize = $('#itemVolume').val();
	var bottlesSold = $('#bottlesSold').val();
	var volume = (bottleSize * bottlesSold) / 1000;
	$('#totalVolume').val(volume.toFixed(2));
	calculateTaxTable();
}

function calculateTaxTable(item) {
	var totalSales = $('#totalSales').val();
	totalSales = parseFloat(totalSales);
	var subTotal = 0;
	var bottleDepositPerBottle = 0.2;
	if ($('#itemVolume').val() < 750) {
		bottleDepositPerBottle = 0.1;
	}

	var bottlesSold = $('#bottlesSold').val();
	var bottleDeposit = bottleDepositPerBottle * bottlesSold;
	var subTotal = totalSales - bottleDeposit;
	var hst = subTotal/1.13*0.13;
	var basicPrice = subTotal - hst;
	var environmentalTax = bottlesSold * 0.0893;
	var lessEnvironmentalTax = basicPrice - environmentalTax;
	var volumeTaxRate = 0.29;
	if ($('#alcoholPercentage').val() < 7) {
		volumeTaxRate = 0.28;
	}
	var volumeTax = volumeTaxRate * $('#totalVolume').val();
	var includingWineTax = lessEnvironmentalTax - volumeTax;
	var wineTax = includingWineTax/1.0610*0.0610;
	var totalPayable = wineTax + volumeTax + environmentalTax;
	var net = basicPrice - totalPayable;

	$('#totalSalesTable').text('$'+totalSales.toFixed(2));
	$('#bottleDeposit').text('($'+bottleDeposit.toFixed(2)+')');
	$('#hst').text('($'+hst.toFixed(2)+')');
	$('#basicPrice').text('$'+basicPrice.toFixed(2));
	$('#environmentalTax').text('$'+environmentalTax.toFixed(2));
	$('#lessEnvironmentalTax').text('$'+lessEnvironmentalTax.toFixed(2));
	$('#volumeTax').text('$'+volumeTax.toFixed(2));
	$('#includingWineTax').text('$'+includingWineTax.toFixed(2));
	$('#wineTax').text('$'+wineTax.toFixed(2));
	$('#totalTaxPayable').text('$'+totalPayable.toFixed(2));
	$('#net').text('$'+net.toFixed(2));

	if (item) {
		item.wineTax = wineTax;
		item.volumeTax = volumeTax;
		item.environmentalTax = environmentalTax;
		item.totalTaxPayable = totalPayable;
		item.taxableSales = includingWineTax;
	}
}

function addItem() {
	var item = {
		name: $('#itemName').val(),
		type: $('#itemType').val(),
		bottleVolume: $('#itemVolume').val(),
		alcoholPercentage: $('#alcoholPercentage').val(),
		finalPrice: parseFloat($('#itemPrice').val()),
		bottlesSold: $('#bottlesSold').val(),
		totalSales: parseFloat($('#totalSales').val()),
		totalVolume: parseFloat($('#totalVolume').val())
	};

	calculateTaxTable(item);
	items.push(item);
	addItemRow(item);
}

function addItemRow(item) {
	var row = $('<tr></tr>');
	var name = $('<td></td>').text(item.name);
	var sales = $('<td></td>').text(item.taxableSales.toFixed(2));
	var volume = $('<td></td>').text(item.totalVolume);
	var wineTax = $('<td></td>').text(item.wineTax.toFixed(2));
	var volumeTax = $('<td></td>').text(item.volumeTax.toFixed(2));
	var environmentalTax = $('<td></td>').text(item.environmentalTax.toFixed(2));
	var totalPayable = $('<td></td>').text(item.totalTaxPayable.toFixed(2));

	row.append(name);
	row.append(sales);
	row.append(volume);
	row.append(wineTax);
	row.append(volumeTax);
	row.append(environmentalTax);
	row.append(totalPayable);

	row.click(function() {
		setItemModal(item);
		calculateTaxTable();
		$('#itemModal').modal();
	});

	$('#itemTableBody').append(row);
	calculateTotalRow();
}

function setItemModal(item) {
	$('#itemName').val(item.name);
	$('#itemType').val(item.type);
	$('#itemVolume').val(item.bottleVolume);
	$('#alcoholPercentage').val(item.alcoholPercentage);
	$('#itemPrice').val(item.finalPrice);
	$('#bottlesSold').val(item.bottlesSold);
	$('#totalSales').val(item.totalSales);
	$('#totalVolume').val(item.totalVolume);
}

function calculateTotalRow() {
	var totalSales = 0;
	var totalVolume = 0;
	var totalWineTax = 0;
	var totalVolumeTax = 0;
	var totalEnvironmentalTax = 0;
	var totalTaxPayable = 0;
	
	items.forEach(function(item) {
		totalSales += item.taxableSales;
		totalVolume += item.totalVolume;
		totalWineTax += item.wineTax;
		totalVolumeTax += item.volumeTax;
		totalEnvironmentalTax += item.environmentalTax;
		totalTaxPayable += item.totalTaxPayable;
	});

	$('#salesTotal').text(totalSales);
	$('#volumeTotal').text(totalVolume.toFixed(2));
	$('#totalBasicTax').text(totalWineTax.toFixed(2));
	$('#totalVolumeTax').text(totalVolumeTax.toFixed(2));
	$('#totalEnvironmentalTax').text(totalEnvironmentalTax.toFixed(2));
	$('#taxPayableTotal').text(totalTaxPayable.toFixed(2));
}