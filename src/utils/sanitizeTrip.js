// src/utils/sanitizeTrip.js

/**
 * Преобразует модель Trip в безопасный для публичного API формат
 * @param {Object} trip — объект из БД с полной информацией
 * @returns {Object} — «обрезанный» объект поездки с минимальным creator
 */
function sanitizeTrip(trip) {
  return {
    id:             trip.id,
    origin:         trip.origin,
    destination:    trip.destination,
    departureTime:  trip.departureTime,
    seats:          trip.seats,
    availableSeats: trip.availableSeats,
    allowBooking:   trip.allowBooking,
    price:          trip.price,
    description:    trip.description,
    status:         trip.status,
    originLat:      trip.originLat,
    originLng:      trip.originLng,
    destinationLat: trip.destinationLat,
    destinationLng: trip.destinationLng,
    // «Скрываем» createdAt/updatedAt или оставляем по необходимости:
    createdAt:      trip.createdAt,
    updatedAt:      trip.updatedAt,

    // Оставляем у creator только безопасные поля:
    creator: {
      id:        trip.creator.id,
      fullName:  trip.creator.fullName,
      photoUrl:  trip.creator.photoUrl,
    },
  };
}

module.exports = sanitizeTrip;
