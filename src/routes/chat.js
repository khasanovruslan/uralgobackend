// File: src/routes/chat.js

const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  addMessage,
  getMessages
} = require('../controllers/chatController');

// Все операции требуют авторизации
router.use(authMiddleware);

// Создать сообщение в чате поездки
router.post('/trips/:tripId/messages', addMessage);

// Получить все сообщения для поездки
router.get('/trips/:tripId/messages', getMessages);

module.exports = router;
