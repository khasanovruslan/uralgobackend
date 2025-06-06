// File: src/controllers/archiveController.js

const Trip = require('../models/Trip');

module.exports = {
  // GET /api/archive
  async getFinishedTrips(req, res) {
    try {
      const finishedTrips = await Trip.query()
        .where('status', 'finished')
        .orderBy('departure_time', 'desc')
        .withGraphFetched('[creator, bookings]');
      return res.json(finishedTrips);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
};
