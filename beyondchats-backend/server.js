const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const scrappingRoutes = require('./src/routes/scrappingRoutes');
const articleRoutes = require('./src/routes/articleRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/articles', articleRoutes);
app.use('/api/scrape', scrappingRoutes);
app.get('/', async (req, res) => {
  res.json({ message: " The backend is working fine" })
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase")
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => console.error(err));

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});