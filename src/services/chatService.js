// File: src/services/chatService.js

const TripMessage = require('../models/TripMessage');
const Trip        = require('../models/Trip');

module.exports = {
  // Добавить сообщение к поездке
  async addMessage(userId, tripId, { content }) {
    // 1) Проверяем, что поездка существует
    const trip = await Trip.query().findById(tripId);
    if (!trip) {
      throw new Error('Поездка не найдена');
    }

    // 2) Вставляем сообщение
    const message = await TripMessage.query().insert({
      tripId,
      userId,
      content,
    });
    return message;
  },

  // Получить все сообщения для конкретной поездки
  async getMessagesByTrip(tripId) {
    return await TripMessage.query()
      .where('trip_id', tripId)
      .orderBy('created_at', 'asc')
      .withGraphFetched('user');
  },
};
