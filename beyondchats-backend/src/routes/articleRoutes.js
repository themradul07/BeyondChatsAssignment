const express = require('express');
const router = express.Router();
const {
  createArticle,
  getAllArticles,
  getArticleCards,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/articles');

router.post('/', createArticle);
router.get('/', getAllArticles);
router.get('/cards', getArticleCards);
router.get('/:id', getArticleById);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

module.exports = router;
