// File: src/repositories/tripsRepo.js

const Trip = require('../models/Trip');

module.exports = {
  /**
   * Создает новую поездку
   * @param {Object} tripData - { creatorId, origin, destination, departureTime, seats, initialPassengers, allowBooking, price, description, originLat, originLng, destinationLat, destinationLng, status }
   * @returns {Promise<Trip>}
   */
  async create(tripData) {
    // Objection сам смэпит creatorId → creator_id, departureTime → departure_time и т.д.
    return await Trip.query().insert(tripData);
  },

  /**
   * Находит поездку по ID (связь creator)
   * @param {number} id
   * @returns {Promise<Trip>}
   */
  async findById(id) {
    return await Trip.query()
      .findById(id)
      .withGraphFetched('creator');
  },

  /**
   * Поиск поездок по критериям
   * @param {Object} filter - { origin?, destination?, date? }
   * @returns {Promise<Trip[]>}
   */
  async findTrips(filter) {
    let query = Trip.query();

    if (filter.origin) {
      // Ilike для регистронезависимого поиска
      query.where('origin', 'ilike', `%${filter.origin}%`);
    }
    if (filter.destination) {
      query.where('destination', 'ilike', `%${filter.destination}%`);
    }
    if (filter.date) {
      // Фильтрация по дате (только дата, без времени)
      query.whereRaw("DATE(departure_time) = ?", [filter.date]);
    }

    return await query.withGraphFetched('creator');
  },

  /**
   * Обновляет поездку по ID (patch)
   * @param {number} id
   * @param {Object} updateData - { origin?, destination?, departureTime?, seats?, allowBooking?, price?, description?, originLat?, originLng?, destinationLat?, destinationLng?, status? }
   * @returns {Promise<Trip>}
   */
  async updateById(id, updateData) {
    // patchAndFetchById возвращает обновленный объект (camelCase все поля)
    return await Trip.query().patchAndFetchById(id, updateData);
  },

  /**
   * Удаляет поездку по ID
   * @param {number} id
   * @returns {Promise<number>} - количество удалённых записей
   */
  async deleteById(id) {
    return await Trip.query().deleteById(id);
  }
};
