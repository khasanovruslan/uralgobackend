// File: src/controllers/eventController.js

const eventService = require('../services/eventService');

module.exports = {
  // POST /api/events
  async createEvent(req, res) {
    try {
      const ownerId = req.user.id;
      const { type, title, latitude, longitude } = req.body;
      const ev = await eventService.createEvent(ownerId, {
        type,
        title,
        latitude,
        longitude,
      });
      return res.status(201).json(ev);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // GET /api/events
  async listEvents(req, res) {
    try {
      const all = await eventService.listAll();
      return res.json(all);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // GET /api/events/:id
  async getEvent(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const ev = await eventService.getById(id);
      return res.json(ev);
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  },

  // POST /api/events/:id/join
  async joinEvent(req, res) {
    try {
      const userId = req.user.id;
      const eventId = parseInt(req.params.id, 10);
      const rec = await eventService.joinEvent(userId, eventId);
      return res.status(201).json(rec);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // DELETE /api/events/:id/leave
  async leaveEvent(req, res) {
    try {
      const userId = req.user.id;
      const eventId = parseInt(req.params.id, 10);
      const result = await eventService.leaveEvent(userId, eventId);
      return res.json(result);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
};
