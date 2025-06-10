// File: src/routes/experiences.js

const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
  createExperience,
  listExperiences,
  getExperience,
  joinExperience,
  leaveExperience,
} = require('../controllers/experienceController');

// Любой endpoint под /api/experiences требует авторизации
router.use(authMiddleware);

// POST   /api/experiences         — создать новую активность
router.post('/', createExperience);

// GET    /api/experiences         — вернуть список всех активностей
router.get('/', listExperiences);

// GET    /api/experiences/:id     — вернуть одну активность по ID
router.get('/:id', getExperience);

// POST   /api/experiences/:id/join — пользователь вступает в активность
router.post('/:id/join', joinExperience);

// DELETE /api/experiences/:id/leave — пользователь выходит из активности
router.delete('/:id/leave', leaveExperience);

module.exports = router;
