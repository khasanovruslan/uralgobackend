// File: src/controllers/authController.js
const authService = require('../services/authService');

module.exports = {
  /**
   * Регистрация пользователя
   */
  async register(req, res) {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  /**
   * Авторизация пользователя
   */
  async login(req, res) {
    try {
      const { user, token } = await authService.login(req.body);
      res.json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
