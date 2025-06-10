// File: src/routes/bookings.js

const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createBooking,
  getUserBookings,
  cancelBooking
} = require('../controllers/bookingController');

// Всё требует авторизации
router.use(authMiddleware);

// Создать бронирование
router.post('/', createBooking);

// Получить все брони текущего пользователя
router.get('/', getUserBookings);

// Отменить бронь
router.delete('/:id', cancelBooking);

module.exports = router;
