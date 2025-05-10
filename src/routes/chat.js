// File: src/routes/chat.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getMessages,
  postMessage
} = require('../controllers/chatController');

// История чата и отправка сообщений
router.get('/', authMiddleware, getMessages);
router.post('/', authMiddleware, postMessage);

module.exports = router;
