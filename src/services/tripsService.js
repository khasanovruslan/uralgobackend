// File: src/services/tripsService.js
const tripsRepo = require('../repositories/tripsRepo');
const userRepo = require('../repositories/userRepo');

module.exports = {
  /**
   * Создает новую поездку
   * @param {number} userId
   * @param {Object} tripData - { origin, destination, departure_time, seats, price, description }
   * @returns {Promise<Object>}
   */
  async createTrip(userId, tripData) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    const trip = await tripsRepo.create({ creator_id: userId, ...tripData });
    return trip;
  },

  /**
   * Получает поездку по ID
   * @param {number} tripId
   * @returns {Promise<Object>}
   */
  async getTripById(tripId) {
    const trip = await tripsRepo.findById(tripId);
    if (!trip) {
      throw new Error('Поездка не найдена');
    }
    return trip;
  },

  /**
   * Поиск поездок по критериям
   * @param {Object} filter - { origin?, destination?, date? }
   * @returns {Promise<Array>} 
   */
  async searchTrips(filter) {
    const trips = await tripsRepo.findTrips(filter);
    return trips;
  },

  /**
   * Обновляет поездку
   * @param {number} userId
   * @param {number} tripId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateTrip(userId, tripId, updateData) {
    const trip = await tripsRepo.findById(tripId);
    if (!trip) {
      throw new Error('Поездка не найдена');
    }
    if (trip.creator_id !== userId) {
      throw new Error('Нет доступа для изменения этой поездки');
    }
    const updated = await tripsRepo.updateById(tripId, updateData);
    return updated;
  },

  /**
   * Удаляет поездку
   * @param {number} userId
   * @param {number} tripId
   * @returns {Promise<void>}
   */
  async deleteTrip(userId, tripId) {
    const trip = await tripsRepo.findById(tripId);
    if (!trip) {
      throw new Error('Поездка не найдена');
    }
    if (trip.creator_id !== userId) {
      throw new Error('Нет доступа для удаления этой поездки');
    }
    await tripsRepo.deleteById(tripId);
  }
};
