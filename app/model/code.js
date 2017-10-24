var mongoose = require('mongoose');

var codeSchema = new mongoose.Schema({
	code: String,
	used: Boolean,
	recipient: Object,
	name: String
});

module.exports = mongoose.model('Code', codeSchema);