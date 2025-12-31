const express = require('express');
const { scrapeWebsite, updateAllArticles } = require('../controllers/scrapper');
const router = express.Router();

router.get('/find-articles', scrapeWebsite);
router.get('/update-articles', updateAllArticles );

module.exports = router;