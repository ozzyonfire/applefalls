var mongoose = require('mongoose');

var wineSchema = new mongoose.Schema({
	name: String,
	size: Number, // the size of the bottle in ml
	numberSold: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Wine', codeSchema);