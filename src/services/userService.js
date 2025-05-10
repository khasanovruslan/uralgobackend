// File: src/services/userService.js
const userRepo = require('../repositories/userRepo');

module.exports = {
  /**
   * Возвращает профиль пользователя
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    return user;
  },

  /**
   * Обновляет профиль пользователя
   * @param {number} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updateData) {
    if (updateData.email) {
      const exists = await userRepo.findByEmail(updateData.email);
      if (exists && exists.id !== userId) {
        throw new Error('Email уже используется');
      }
    }
    const updated = await userRepo.updateById(userId, updateData);
    return updated;
  }
};