const Article = require('../models/Article');

// Create a new article
const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get articles for cards (updated ones only)
const getArticleCards = async (req, res) => {
  try {
    const resArticles = await Article.find({ isUpdated: true });
    const filteredArticles = resArticles.map((art) => ({
      id: art._id,
      title: art.title,
      content: art.content.slice(0, 200) + "...",
    }));
    res.json(filteredArticles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update article by ID
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete article by ID
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleCards,
  getArticleById,
  updateArticle,
  deleteArticle
};
