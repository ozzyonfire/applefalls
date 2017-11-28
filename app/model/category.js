var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var categorySchema = new mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	minimumOrder: Number
});

module.exports = mongoose.model('Category', categorySchema);