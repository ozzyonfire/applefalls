var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var itemSchema = new mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	categoryName: String,
	options: [{
		name: String,
		price: Number,
		minimumQuantity: Number
	}],
	squareId: String,
	squareItem: Boolean,
	description: String,
	alcoholPercentage: Number,
	bottleSize: Number,
	images: [String],
	taxes: [{
		name: String,
		type: String,
		percentage: Number
	}]
});

module.exports = mongoose.model('Item', itemSchema);