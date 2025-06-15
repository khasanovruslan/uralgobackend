// File: src/routes/trips.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createTrip,
  getTrip,
  searchTrips,
  updateTrip,
  deleteTrip,
  getMyCreated, 
  getMyJoined,
} = require('../controllers/tripsController');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// POST   /api/trips       — создание новой поездки
router.post('/', createTrip);

// GET    /api/trips?origin=&destination=&date= — поиск/список
router.get('/', searchTrips);

// GET    /api/trips/:id   — получить одну поездку
router.get('/:id', getTrip);

// PUT    /api/trips/:id   — обновить поездку
router.put('/:id', updateTrip);

// DELETE /api/trips/:id   — удалить поездку
router.delete('/:id', deleteTrip);

router.get('/my/created', getMyCreated);

router.get('/my/joined',  getMyJoined);

module.exports = router;
