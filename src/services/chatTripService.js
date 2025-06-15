
// src/services/chatTripService.js
const TripMessage = require('../models/TripMessage');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

module.exports = {
  // Получить все сообщения чата поездки
  async getMessagesByTrip(tripId) {
    return await TripMessage.query()
      .where('trip_id', tripId)
      .orderBy('created_at', 'asc')
      .withGraphFetched('user(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'full_name', 'avatar_url');
        },
      });
  },

  // Добавить сообщение в чат поездки
    async addMessage(userId, tripId, { content }) {
      // 1. Проверить, что поездка существует
      const trip = await Trip.query().findById(tripId);
      if (!trip) throw new Error('Поездка не найдена');

      // 2. Проверить, что пользователь — участник поездки или её создатель
      const isCreator = trip.creatorId === userId;
      const isBooking = await Booking.query()
        .where('trip_id', tripId)
        .where('user_id', userId)
        .whereIn('status', ['pending','confirmed'])
        .first();
      if (!isCreator && !isBooking) throw new Error('Вы не участник этой поездки');

      // 3. Вставить сообщение
      const message = await TripMessage.query().insert({
        tripId,
        userId,
        content,
      });

    // 4. Вернуть сообщение с пользователем
    return await TripMessage.query()
      .findById(message.id)
      .withGraphFetched('user(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'full_name', 'avatar_url');
        }
      });
  },
};
