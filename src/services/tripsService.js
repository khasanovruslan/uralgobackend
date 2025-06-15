// File: src/services/tripsService.js

const tripsRepo = require('../repositories/tripsRepo');
const userRepo  = require('../repositories/userRepo');
const bookingRepo   = require('../repositories/bookingsRepo'); 


module.exports = {
  /**
   * Создает новую поездку
   * @param {number} userId
   * @param {Object} tripData - { origin, destination, departureTime, seats, allowBooking, price, description, originLat, originLng, destinationLat, destinationLng, status? }
   * @returns {Promise<Object>}
   */
  async createTrip(userId, tripData) {
    // Проверяем, что пользователь существует
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    // Сразу используем camelCase: creatorId
    const toInsert = {
      creatorId: userId,
      origin: tripData.origin,
      destination: tripData.destination,
      departureTime: tripData.departureTime,
      seats: tripData.seats,
      allowBooking: tripData.allowBooking,
      price: tripData.price ?? null,
      description: tripData.description ?? null,
      originLat: tripData.originLat ?? null,
      originLng: tripData.originLng ?? null,
      destinationLat: tripData.destinationLat ?? null,
      destinationLng: tripData.destinationLng ?? null,
      status: tripData.status || 'planned',
    };

    const trip = await tripsRepo.create(toInsert);
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
    // Параметры фильтра: origin, destination, date
    const trips = await tripsRepo.findTrips(filter);
    return trips;
  },

  /**
   * Обновляет поездку
   * @param {number} userId
   * @param {number} tripId
   * @param {Object} updateData - { origin?, destination?, departureTime?, seats?, allowBooking?, price?, description?, originLat?, originLng?, destinationLat?, destinationLng?, status? }
   * @returns {Promise<Object>}
   */
  async updateTrip(userId, tripId, updateData) {
    const trip = await tripsRepo.findById(tripId);
    if (!trip) {
      throw new Error('Поездка не найдена');
    }
    // В Trip из БД Objection отдаёт camelCase-свойства
    if (trip.creatorId !== userId) {
      throw new Error('Нет доступа для изменения этой поездки');
    }

    // Обновляем только те поля, что переданы (camelCase)
    const patch = {};
    if (updateData.origin !== undefined)         patch.origin = updateData.origin;
    if (updateData.destination !== undefined)    patch.destination = updateData.destination;
    if (updateData.departureTime !== undefined)  patch.departureTime = updateData.departureTime;
    if (updateData.seats !== undefined)          patch.seats = updateData.seats;
    if (updateData.allowBooking !== undefined)   patch.allowBooking = updateData.allowBooking;
    if (updateData.price !== undefined)          patch.price = updateData.price;
    if (updateData.description !== undefined)    patch.description = updateData.description;
    if (updateData.originLat !== undefined)      patch.originLat = updateData.originLat;
    if (updateData.originLng !== undefined)      patch.originLng = updateData.originLng;
    if (updateData.destinationLat !== undefined) patch.destinationLat = updateData.destinationLat;
    if (updateData.destinationLng !== undefined) patch.destinationLng = updateData.destinationLng;
    if (updateData.status !== undefined)         patch.status = updateData.status;

    const updated = await tripsRepo.updateById(tripId, patch);
    return updated;
  },

  /**
   * Удаляет поездку
   * @param {number} userId
   * @param {number} tripId
   */
  async deleteTrip(userId, tripId) {
    const trip = await tripsRepo.findById(tripId);
    if (!trip) {
      throw new Error('Поездка не найдена');
    }
    if (trip.creatorId !== userId) {
      throw new Error('Нет доступа для удаления этой поездки');
    }
    await tripsRepo.deleteById(tripId);
  },
  async getCreatedByUser(userId) {
    // Просто фильтруем по creatorId и подтягиваем creator
    return await tripsRepo.findTrips({ creatorId: userId });
  },

  /**
   * Получить поездки, в которых участвует пользователь, но не его собственные
   */
  async getJoinedByUser(userId) {
  // Получаем все бронирования пользователя (pending/confirmed)
  const bookings = await bookingRepo.findByUser(userId, ['pending', 'confirmed']);
  if (!bookings.length) return [];

  const tripIds = bookings.map(b => b.tripId);

  // Получаем все поездки, исключая свои
  const trips = await tripsRepo.findTrips({
    ids: tripIds,
    excludeCreatorId: userId,
  });

  // Сопоставляем поездку и бронирование
  // Создаем map: tripId -> booking
  const bookingsMap = {};
  bookings.forEach(b => {
    bookingsMap[b.tripId] = b;
  });

  function sanitizeCreator(creator) {
  if (!creator) return null;
  return {
    id: creator.id,
    fullName: creator.fullName,
    photoUrl: creator.photoUrl ?? creator.avatarUrl ?? null,
  };
}

  // Для каждой поездки добавляем bookingId
  return trips.map(trip => ({
    ...trip,
    creator: sanitizeCreator(trip.creator),
    bookingId: bookingsMap[trip.id]?.id,
    bookingStatus: bookingsMap[trip.id]?.status,
  }));
},
};
