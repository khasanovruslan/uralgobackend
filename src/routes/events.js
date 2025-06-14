// File: src/routes/events.js

const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multer'); // ваш multer
const {
  createEvent,
  listEvents,
  getEvent,
  joinEvent,
  leaveEvent,
  listCreated,
  listJoined,
} = require('../controllers/eventController');

// Все действия требуют аутентификации
router.use(authMiddleware);

router.post(
  '/', 
  upload.single('photo'),        // <— добавляем multer
  createEvent
);

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
// после всех остальных
router.get('/my/created', listCreated);
router.get('/my/joined',  listJoined);


module.exports = router;
