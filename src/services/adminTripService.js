// File: src/services/adminTripService.js
const Trip = require('../models/Trip');

module.exports = {
  listTrips() {
    return Trip.query();
  },

  getTripById(id) {
    return Trip.query().findById(id);
  },

  createTrip(data) {
    return Trip.query().insertAndFetch(data);
  },

  updateTrip(id, data) {
    return Trip.query().patchAndFetchById(id, data);
  },

  deleteTrip(id) {
    return Trip.query().deleteById(id);
  },
};
