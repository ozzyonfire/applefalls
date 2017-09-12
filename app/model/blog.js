var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
	author: String,
	date: Date,
	title: String,
	published: Boolean,
	tags: [String],
	content: String
});

module.exports = mongoose.model('Blog', blogSchema);