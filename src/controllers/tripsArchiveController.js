// File: src/controllers/tripsArchiveController.js
const { Model } = require('objection');
const Trip = require('../models/Trip');

module.exports = {
  /** Получение архивных (проехавших) поездок */
  async getArchivedTrips(req, res) {
    try {
      const now = new Date().toISOString();
      const list = await Trip.query()
        .where('departure_time', '<', now)
        .withGraphFetched('creator');
      res.json(list);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};