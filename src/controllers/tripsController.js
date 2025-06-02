// File: src/controllers/tripsController.js
const tripsService = require('../services/tripsService');

module.exports = {
  /** Создание новой поездки */
  async createTrip(req, res) {
    try {
      // Раньше: req.userId — undefined
      // Стало: забираем id из req.user
      const trip = await tripsService.createTrip(req.user.id, req.body);
      res.status(200).json(trip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  /** Получение поездки по ID */
  async getTrip(req, res) {
    try {
      const trip = await tripsService.getTripById(req.params.id);
      res.json(trip);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  /** Поиск поездок по критериям */
  async searchTrips(req, res) {
    try {
      const filter = {
        origin: req.query.origin,
        destination: req.query.destination,
        date: req.query.date
      };
      const list = await tripsService.searchTrips(filter);
      res.json(list);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  /** Обновление поездки */
  async updateTrip(req, res) {
    try {
      const updated = await tripsService.updateTrip(
        req.user.id,      // тоже поправляем здесь
        req.params.id,
        req.body
      );
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  /** Удаление поездки */
  async deleteTrip(req, res) {
    try {
      await tripsService.deleteTrip(req.user.id, req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
