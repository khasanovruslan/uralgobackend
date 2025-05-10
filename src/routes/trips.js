// File: src/routes/trips.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createTrip,
  getTrip,
  searchTrips,
  updateTrip,
  deleteTrip
} = require('../controllers/tripsController');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Создать поездку
router.post('/', createTrip);

// Поиск поездок (параметры: ?origin=&destination=&date=)
router.get('/', searchTrips);

// Получить поездку по ID
router.get('/:id', getTrip);

// Обновить поездку
router.put('/:id', updateTrip);

// Удалить поездку
router.delete('/:id', deleteTrip);

module.exports = router;