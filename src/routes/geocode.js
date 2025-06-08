// File: src/routes/geocode.js
const express = require('express');
const fetch   = require('node-fetch'); // npm install node-fetch@2
const router  = express.Router();

router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ message: 'city parameter is required' });

  try {
    const url = 'https://nominatim.openstreetmap.org/search' +
      `?format=json&limit=1&q=${encodeURIComponent(city)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'UralGo/1.0 (+https://uralgo.example.com)' }
    });
    const data = await response.json();
    if (!data.length) return res.status(404).json({ message: 'Not found' });
    return res.json({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
  } catch (err) {
    console.error('Geocode error:', err);
    return res.status(500).json({ message: 'Geocoding failed' });
  }
});

module.exports = router;
