// File: src/routes/geocode.js
const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

router.get('/', async (req, res) => {
  const city  = req.query.city;
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
  if (!city) return res.status(400).json({ message: 'city parameter is required' });

  try {
    const url = 'https://nominatim.openstreetmap.org/search' +
      `?format=json&limit=${limit}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'UralGo/1.0 (+https://uralgo.example.com)' }
    });
    const data = await response.json();
    // Отправляем массив подсказок напрямую клиенту
    return res.json(data);
  } catch (err) {
    console.error('Geocode error:', err);
    return res.status(500).json({ message: 'Geocoding failed' });
  }
});

module.exports = router;
