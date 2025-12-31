const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  oldcontent: String,
  content: String,
  link: String,
  isUpdated: { type: Boolean, default: false },
  references: [String],
  date: String,
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);