// File: src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepo');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

module.exports = {
  /**
   * Регистрирует нового пользователя и возвращает токен JWT
   * @param {Object} userData - { name, email, password, phone }
   * @returns {Promise<{ user: Object, token: string }>}
   */

  async register(userData) {
    const existing = await userRepo.findByEmail(userData.email);
    if (existing) {
      throw new Error('Пользователь с таким email уже существует');
    }
    const hashed = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const user = await userRepo.create({ ...userData, password: hashed });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { user, token };
  },

  /**
   * Логинит пользователя по email и паролю, возвращает JWT
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Неверный email или пароль');
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { user, token };
  }
};
