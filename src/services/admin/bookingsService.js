// src/services/admin/bookingsService.js
const Booking = require('../../models/Booking');

module.exports = {
  list() {
    return Booking.query();
  },

  getById(id) {
    return Booking.query().findById(id);
  },

  create(data) {
    // seatsReserved должно быть integer ≥1
    return Booking.query().insertAndFetch(data);
  },

  update(id, data) {
    return Booking.query().patchAndFetchById(id, data);
  },

  delete(id) {
    return Booking.query().deleteById(id);
  },
};
