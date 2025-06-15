const express = require('express');
const fetch   = require('node-fetch');
const NodeCache = require('node-cache');
const router  = express.Router();

// Кэш на 1 час, чтобы не перегружать Nominatim
const geoCache = new NodeCache({ stdTTL: 60 * 60 });

router.get('/', async (req, res) => {
  const city  = req.query.city;
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
  if (!city) return res.status(400).json({ message: 'city parameter is required' });

  const cacheKey = `${city.toLowerCase()}:${limit}`;
  const cached = geoCache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const base = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      format: 'json',
      limit:  limit.toString(),
      q:      city,
      'accept-language': 'ru',
      countrycodes:      'ru',
    });
    const url = `${base}?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'UralGo/1.0 (+https://uralgo.example.com)' }
    });
    const data = await response.json();

    // Фильтруем только населённые пункты
    const allowed = new Set(['city','town','village','hamlet','locality']);
    const filtered = (data || []).filter(i =>
      i.class === 'place' && allowed.has(i.type)
    );

    geoCache.set(cacheKey, filtered);
    res.json(filtered);
  } catch (err) {
    console.error('Geocode error:', err);
    res.status(500).json({ message: 'Geocoding failed' });
  }
});

module.exports = router;
