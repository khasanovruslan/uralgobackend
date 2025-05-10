// File: src/repositories/userRepo.js
const User = require('../models/User');

module.exports = {
  /**
   * Создает нового пользователя
   * @param {Object} userData - { name, email, password, phone }
   * @returns {Promise<User>}
   */
  async create(userData) {
    return await User.query().insert(userData);
  },

  /**
   * Находит пользователя по ID
   * @param {number} id
   * @returns {Promise<User>}
   */
  async findById(id) {
    return await User.query().findById(id);
  },

  /**
   * Находит пользователя по Email
   * @param {string} email
   * @returns {Promise<User>}
   */
  async findByEmail(email) {
    return await User.query().findOne({ email });
  },

  /**
   * Обновляет пользователя по ID
   * @param {number} id
   * @param {Object} updateData
   * @returns {Promise<User>}
   */
  async updateById(id, updateData) {
    return await User.query().patchAndFetchById(id, updateData);
  }
};
