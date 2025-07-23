// routes/urlRoutes.js

const express = require('express');
const router = express.Router();
const { shortenURL } = require('../controllers/urlController');

router.post('/shorten', async (req, res) => {
  const { longURL } = req.body;
  if (!longURL) {
    return res.status(400).json({ error: 'longURL is required' });
  }

  try {
    const short = await shortenURL(longURL);
    res.json({ shortURL: short });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
