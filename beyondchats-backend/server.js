const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const articleRoutes = require('./src/routes/articleRoutes');
const { getGoogleLinks } = require('./src/utils/scrapping');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/articles', articleRoutes);
app.use('/api/scrape', require('./src/routes/scrappingRoutes'));
app.get('/', async (req, res) => {
  try {
    const data = await getGoogleLinks('Beyond Chats AI tools');

    res.json({
      message: 'Welcome to the Articles API',
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch articles',
      error: error.message
    });
  }
});



mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase")
  .then(() => {
    console.log('MongoDB Connected');

  })
  .catch(err => console.error(err));

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});