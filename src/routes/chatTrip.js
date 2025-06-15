// src/routes/chatTrip.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const chatTripController = require('../controllers/chatTripController');

router.use(authMiddleware);

// Получить все сообщения чата поездки
router.get('/trips/:tripId/chat/messages', chatTripController.getMessages);

// Добавить сообщение в чат поездки
router.post('/trips/:tripId/chat/messages', chatTripController.addMessage);

module.exports = router;
