// File: src/routes/tripsArchive.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getArchivedTrips } = require('../controllers/tripsArchiveController');

// Архив поездок (прошедшие)
router.get('/', authMiddleware, getArchivedTrips);

module.exports = router;