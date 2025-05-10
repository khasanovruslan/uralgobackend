// File: src/routes/auth.js
const router = require('express').Router();
const { register, login } = require('../controllers/authController');

// Регистрация и авторизация
router.post('/register', register);
router.post('/login', login);

module.exports = router;
