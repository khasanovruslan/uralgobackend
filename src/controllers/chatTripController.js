// src/controllers/chatTripController.js
const chatSvc = require('../services/chatTripService');

module.exports = {
  // GET /api/trips/:tripId/chat/messages
  async getMessages(req, res) {
    try {
      const tripId = +req.params.tripId;
      const messages = await chatSvc.getMessagesByTrip(tripId);
      res.json(messages);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  // POST /api/trips/:tripId/chat/messages
  async addMessage(req, res) {
    try {
      const userId = req.user.id;
      const tripId = +req.params.tripId;
      const { content } = req.body;
      if (!content) return res.status(400).json({ message: 'Текст сообщения не может быть пустым' });

      const msg = await chatSvc.addMessage(userId, tripId, { content });
      res.status(201).json(msg);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
};
