// File: src/routes/user.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multer');
const { getProfile, updateProfile } = require('../controllers/userController');
// Получение и обновление профиля текущего пользователя
router.get('/', authMiddleware, getProfile);


// обновление профиля + аватар (multipart/form-data)
router.put(
  '/',
  authMiddleware,
  upload.single('photo'),
  updateProfile
);

module.exports = router;