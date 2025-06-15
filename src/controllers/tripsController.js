// File: src/controllers/tripsController.js
const tripsService = require('../services/tripsService');
const sanitizeTrip = require('../utils/sanitizeTrip');
const bookingRepo   = require('../repositories/bookingsRepo'); 

module.exports = {
  /** Создание новой поездки */
  async createTrip(req, res) {
    try {
      // Теперь req.user.id гарантированно определён (authMiddleware)
      const trip = await tripsService.createTrip(req.user.id, req.body);
      // Возвращаем статус 201 (Created) — по REST рекомендациям
      return res.status(201).json(trip);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  /** Получение поездки по ID */
  async getTrip(req, res) {
    try {
      const trip = await tripsService.getTripById(Number(req.params.id));
      return res.json(trip);
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  },

  /** Поиск поездок по критериям (query params: origin, destination, date) */
  async searchTrips(req, res) {
    try {
      const filter = {
        origin:      req.query.origin,
        destination: req.query.destination,
        date:        req.query.date,
        minSeats:    Number(req.query.pax || 1),   // ← вот эта строка
        limit:       Number(req.query.limit || 20), 
        offset:      Number(req.query.offset || 0),
      };

      const list = await tripsService.searchTrips(filter);
           // Преобразуем каждый trip в безопасный формат:
     const safeList = list.map(sanitizeTrip);
     return res.json(safeList);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  /** Обновление поездки */
  async updateTrip(req, res) {
    try {
      const updated = await tripsService.updateTrip(
        req.user.id,                  // теперь правильно
        Number(req.params.id),
        req.body
      );
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  /** Удаление поездки */
  async deleteTrip(req, res) {
    try {
      await tripsService.deleteTrip(req.user.id, Number(req.params.id));
      return res.status(204).end();
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  async getMyCreated(req, res) {
    try {
      const list = await tripsService.getCreatedByUser(req.user.id);
      return res.json(list);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // GET /api/trips/my/joined
  async getMyJoined(req, res) {
    try {
      const list = await tripsService.getJoinedByUser(req.user.id);
      return res.json(list);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};
