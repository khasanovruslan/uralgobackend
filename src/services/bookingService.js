// File: src/services/bookingService.js

const Booking = require('../models/Booking');
const Trip    = require('../models/Trip');

module.exports = {
  // Создать бронирование: уменьшить availableSeats в Trip
  async create(userId, { tripId, seatsReserved }) {
  // 1) Проверяем существование поездки
  const trip = await Trip.query().findById(tripId);
  if (!trip) {
    throw new Error('Поездка не найдена');
  }

  // 1.1) Запрещаем автору бронировать свою же поездку
  if (trip.creatorId === userId) {
    throw new Error('Нельзя бронировать свою поездку');
  }

  // 2) Проверяем доступность мест
  if (trip.seats < seatsReserved) {
    throw new Error('Недостаточно свободных мест');
  }

  // 3) Проверяем, есть ли уже бронь
  let existing = await Booking.query()
  .where('user_id', userId)
  .where('trip_id', tripId)
  .first();

  if (existing) {
    if (existing.status === 'canceled') {
      // Реактивируем
      await Booking.query().findById(existing.id).patch({
        seatsReserved,
        status: 'pending',
        updatedAt: new Date().toISOString(),
      });

      // Уменьшаем availableSeats
      await Trip.query().findById(tripId).patch({
        seats: trip.seats - seatsReserved,
      });

      return await Booking.query().findById(existing.id);
    } else {
      throw new Error('Вы уже забронировали эту поездку');
    }
  }

  // 4) Создаём новую бронь
  const booking = await Booking.query().insert({
    userId,
    tripId,
    seatsReserved,
    status: 'pending',
  });

  // 5) Уменьшаем availableSeats
  await Trip.query().findById(tripId).patch({
    seats: trip.seats - seatsReserved,
  });

  return booking;
},

  // Получить все бронирования текущего пользователя
  async getByUser(userId) {
    return await Booking.query()
      .where('user_id', userId)
      .withGraphFetched('[trip]');
  },

  // Отменить бронирование (вернуть места, если бронь не отменена)
  async cancel(userId, bookingId) {
    // 1) Получаем бронь
    const booking = await Booking.query().findById(bookingId);
    if (!booking) {
      throw new Error('Бронирование не найдено');
    }

    // 2) Проверяем, что бронь принадлежит пользователю
    if (booking.userId !== userId) {
      throw new Error('Нельзя отменить чужое бронирование');
    }

    // 3) Если статус !== 'canceled', возвращаем места поездке
    if (booking.status !== 'canceled') {
      const trip = await Trip.query().findById(booking.tripId);
      await Trip.query().findById(booking.tripId).patch({ seats: trip.seats + booking.seatsReserved });
    }

    // 4) Обновляем статус в bookings на 'canceled'
    await Booking.query().findById(bookingId).patch({ status: 'canceled' });

    return { message: 'Бронирование отменено' };
  },
};
