// File: src/repositories/tripsRepo.js
const Trip = require('../models/Trip');

module.exports = {
  /**
   * Создает новую поездку
   * @param {Object} tripData - { creator_id, origin, destination, departure_time, seats, price, description }
   * @returns {Promise<Trip>}
   */
  async create(tripData) {
    return await Trip.query().insert(tripData);
  },

  /**
   * Находит поездку по ID
   * @param {number} id
   * @returns {Promise<Trip>}
   */
  async findById(id) {
    return await Trip.query().findById(id).withGraphFetched('creator');
  },

  /**
   * Поиск поездок по критериям
   * @param {Object} filter - { origin?, destination?, date? }
   * @returns {Promise<Trip[]>}
   */
  async findTrips(filter) {
    let query = Trip.query();
    if (filter.origin) {
      query.where('origin', 'ilike', `%${filter.origin}%`);
    }
    if (filter.destination) {
      query.where('destination', 'ilike', `%${filter.destination}%`);
    }
    if (filter.date) {
      query.whereRaw("DATE(departure_time) = ?", [filter.date]);
    }
    return await query.withGraphFetched('creator');
  },

  /**
   * Обновляет поездку по ID
   * @param {number} id
   * @param {Object} updateData
   * @returns {Promise<Trip>}
   */
  async updateById(id, updateData) {
    return await Trip.query().patchAndFetchById(id, updateData);
  },

  /**
   * Удаляет поездку по ID
   * @param {number} id
   * @returns {Promise<number>} - количество удаленных записей
   */
  async deleteById(id) {
    return await Trip.query().deleteById(id);
  }
};
