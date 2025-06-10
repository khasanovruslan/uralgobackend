// File: src/routes/events.js

const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createEvent,
  listEvents,
  getEvent,
  joinEvent,
  leaveEvent,
} = require('../controllers/eventController');

// Все действия требуют аутентификации
router.use(authMiddleware);

// Создать новое мероприятие
router.post('/', createEvent);

// Получить список всех мероприятий
router.get('/', listEvents);

// Получить конкретное мероприятие по ID
router.get('/:id', getEvent);

// Вступить в мероприятие
router.post('/:id/join', joinEvent);

// Выйти из мероприятия
router.delete('/:id/leave', leaveEvent);

module.exports = router;
