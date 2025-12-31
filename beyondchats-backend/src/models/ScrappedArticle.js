const mongoose = require('mongoose');

const ScrappedArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  sourceUrl: String,
  isUpdated: { type: Boolean, default: false },
  references: [String]
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);