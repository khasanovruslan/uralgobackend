// File: src/routes/user.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

// Получение и обновление профиля текущего пользователя
router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);

module.exports = router;