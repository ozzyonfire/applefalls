var items = [];

var nonTaxableWine = {
	sales: {},
	volume: {}
};
var nonTaxableCooler = {
	sales: {},
	volume: {}
};

var totalTaxableWineSales = 0;
var totalTaxableCoolerSales = 0;
var totalTaxableWineVolume = 0;
var totalTaxableCoolerVolume = 0;

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

	$('.calcNonTax').on('input', function() {
		calculateNonTaxable();
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
		item.taxableSales = includingWineTax/1.061;
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
	var totalContainers = 0;
	totalTaxableWineSales = 0;
	totalTaxableCoolerSales = 0;
	totalTaxableWineVolume = 0;
	totalTaxableCoolerVolume = 0;
	var totalWineVolumeTax = 0;
	var totalCoolerVolumeTax = 0;


	items.forEach(function(item) {
		totalSales += item.taxableSales;
		totalVolume += item.totalVolume;
		totalWineTax += item.wineTax;
		totalVolumeTax += item.volumeTax;
		totalEnvironmentalTax += item.environmentalTax;
		totalTaxPayable += item.totalTaxPayable;
		totalContainers += item.bottlesSold;

		if (item.alcoholPercentage < 7) {
			totalTaxableCoolerSales += item.taxableSales;
			totalTaxableCoolerVolume += item.totalVolume;
			totalCoolerVolumeTax += item.volumeTax;
		} else {
			totalTaxableWineSales += item.taxableSales;
			totalTaxableWineVolume += item.totalVolume;
			totalWineVolumeTax += item.volumeTax;
		}
	});

	$('#salesTotal').text(totalSales.toFixed(2));
	$('#volumeTotal').text(totalVolume.toFixed(2));
	$('#totalBasicTax').text(totalWineTax.toFixed(2));
	$('#totalVolumeTax').text(totalVolumeTax.toFixed(2));
	$('#containersTotal').text(totalContainers);
	$('#totalEnvironmentalTax').text(totalEnvironmentalTax.toFixed(2));
	$('#taxPayableTotal').text(totalTaxPayable.toFixed(2));
	$('#totalTaxableWineSales').text(totalTaxableWineSales.toFixed(2));
	$('#totalTaxableCoolerSales').text(totalTaxableCoolerSales.toFixed(2));
	$('#totalTaxableWineVolume').text(totalTaxableWineVolume.toFixed(2));
	$('#totalTaxableCoolerVolume').text(totalTaxableCoolerVolume.toFixed(2));
	$('#totalWineVolumeTax').text(totalWineVolumeTax.toFixed(2));
	$('#totalCoolerVolumeTax').text(totalCoolerVolumeTax.toFixed(2));
}

function calculateNonTaxable() {
	var totalSalesWine = 0;
	var totalVolumeWine = 0;
	var totalSalesCooler = 0;
	var totalVolumeCooler = 0;

	totalSalesWine += nonTaxableWine.sales.directDelivery = parseFloat($('#directDeliveryLicenseeSalesWine').val());
	totalVolumeWine += nonTaxableWine.volume.directDelivery = parseFloat($('#directDeliveryLicenseeVolumeWine').val());
	totalSalesCooler += nonTaxableCooler.sales.directDelivery = parseFloat($('#directDeliveryLicenseeSalesCooler').val());
	totalVolumeCooler += nonTaxableCooler.volume.directDelivery = parseFloat($('#directDeliveryLicenseeVolumeCooler').val());

	totalSalesWine += nonTaxableWine.sales.dutyFree = parseFloat($('#dutyFreeSalesWine').val());
	totalVolumeWine += nonTaxableWine.volume.dutyFree = parseFloat($('#dutyFreeVolumeWine').val());
	totalSalesCooler += nonTaxableCooler.sales.dutyFree = parseFloat($('#dutyFreeSalesCooler').val());
	totalVolumeCooler += nonTaxableCooler.volume.dutyFree = parseFloat($('#dutyFreeVolumeCooler').val());

	totalSalesWine += nonTaxableWine.sales.lcbo = parseFloat($('#lcboSalesWine').val());
	totalVolumeWine += nonTaxableWine.volume.lcbo = parseFloat($('#lcboVolumeWine').val());
	totalSalesCooler += nonTaxableCooler.sales.lcbo = parseFloat($('#lcboSalesCooler').val());
	totalVolumeCooler += nonTaxableCooler.volume.lcbo = parseFloat($('#lcboVolumeCooler').val());

	totalSalesWine += nonTaxableWine.sales.ontarioWineries = parseFloat($('#ontarioWineriesSalesWine').val());
	totalVolumeWine += nonTaxableWine.volume.ontarioWineries = parseFloat($('#ontarioWineriesVolumeWine').val());
	totalSalesCooler += nonTaxableCooler.sales.ontarioWineries = parseFloat($('#ontarioWineriesSalesCooler').val());
	totalVolumeCooler += nonTaxableCooler.volume.ontarioWineries = parseFloat($('#ontarioWineriesVolumeCooler').val());

	totalSalesWine += nonTaxableWine.sales.exports = parseFloat($('#exportsSalesWine').val());
	totalVolumeWine += nonTaxableWine.volume.exports = parseFloat($('#exportsVolumeWine').val());
	totalSalesCooler += nonTaxableCooler.sales.exports = parseFloat($('#exportsSalesCooler').val());
	totalVolumeCooler += nonTaxableCooler.volume.exports = parseFloat($('#exportsVolumeCooler').val());

	nonTaxableWine.sales.total = totalSalesWine;
	nonTaxableWine.volume.total = totalVolumeWine;
	nonTaxableCooler.sales.total = totalSalesCooler;
	nonTaxableCooler.volume.total = totalVolumeCooler;

	$('#totalSalesWine').val(totalSalesWine);
	$('#totalVolumeWine').val(totalVolumeWine);
	$('#totalSalesCooler').val(totalSalesCooler);
	$('#totalVolumeCooler').val(totalVolumeCooler);
}