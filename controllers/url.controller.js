// controllers/urlController.js

const fetch = require('node-fetch'); // if using Node <18

async function shortenURL(longURL) {
  const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }
    const shortURL = await response.text();
    return shortURL;
  } catch (error) {
    throw new Error("Shortening error: " + error.message);
  }
}

module.exports = { shortenURL };
