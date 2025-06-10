// src/routes/geonames.js
const router = require('express').Router()
const fetch = require('node-fetch') // или built-in в Node.js 18+
const USER = process.env.GEONAMES_USER
if (!USER) {
  console.warn('GEONAMES_USER не задан')
}

router.get('/', async (req, res) => {
  const q = encodeURIComponent(req.query.q || '')
  const url = `http://api.geonames.org/searchJSON?username=${USER}` +
              `&country=RU&featureClass=P&maxRows=10&lang=ru&name_startsWith=${q}`
  try {
    const geo = await fetch(url).then(r => r.json())
    if (!geo.geonames) {
      return res.status(502).json({ message: 'GeoNames вернул не тот формат' })
    }
    const list = geo.geonames.map(c => ({
      city:   c.name,
      region: c.adminName1
    }))
    res.json(list)
  } catch (err) {
    console.error('Ошибка GeoNames-прокси:', err)
    res.status(500).json({ message: 'Сервис геокодинга недоступен' })
  }
})

module.exports = router
