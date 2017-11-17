var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var cartSchema = new mongoose.Schema({
	sessionID: {
		type: String,
		unique: true,
		index: true
	},
	order: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Cart', cartSchema);