// File: src/controllers/userController.js
const userService = require('../services/userService');

module.exports = {
  /** Получение профиля текущего пользователя */
  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.userId);
      res.json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  /** Обновление профиля текущего пользователя */
  async updateProfile(req, res) {
    try {
      const updated = await userService.updateProfile(req.userId, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};