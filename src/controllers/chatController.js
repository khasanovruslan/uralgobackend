// File: src/controllers/chatController.js

const chatService = require('../services/chatService');

module.exports = {
  // POST /api/chat/trips/:tripId/messages
  async addMessage(req, res) {
    try {
      const userId = req.user.id;
      const tripId = parseInt(req.params.tripId, 10);
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: 'Текст сообщения не может быть пустым' });
      }

      const message = await chatService.addMessage(userId, tripId, { content });
      return res.status(201).json(message);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // GET /api/chat/trips/:tripId/messages
  async getMessages(req, res) {
    try {
      const tripId = parseInt(req.params.tripId, 10);
      const messages = await chatService.getMessagesByTrip(tripId);
      return res.json(messages);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
};
