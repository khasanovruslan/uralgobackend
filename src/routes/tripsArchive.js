// File: src/routes/tripsArchive.js

const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getFinishedTrips } = require('../controllers/archiveController');

// Все операции требуют авторизации
router.use(authMiddleware);

// Получить все завершённые поездки
router.get('/', getFinishedTrips);

module.exports = router;
