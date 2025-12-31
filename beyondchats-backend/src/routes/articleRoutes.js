const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

router.post('/', async (req, res) => {
  const article = await Article.create(req.body);
  res.json(article);
});

router.get('/', async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

router.get('/cards', async (req, res) => {
  const resArticles = await Article.find({ isUpdated: true });
  const filteredArticles = resArticles.map((art) => ({
    id: art._id,
    title: art.title,
    content: art.content.slice(0, 200) + "...",
  }));

  return res.json(filteredArticles);
});

router.get('/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.json(article);
});

router.put('/:id', async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(article);
});

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;