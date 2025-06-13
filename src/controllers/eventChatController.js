// src/controllers/eventChatController.js
const chatSvc = require('../services/chatEventService');

module.exports = {
  // GET  /api/events/:eventId/chat
  async getEventChat(req, res) {
    try {
      const chat = await chatSvc.getChatWithMessages(+req.params.eventId);
      res.json(chat);
    } catch (e) {
      res.status(404).json({ message: e.message });
    }
  },

  // POST /api/events/:eventId/chat/messages
  async postEventChatMessage(req, res) {
    try {
      const msg = await chatSvc.postMessage(
        +req.params.eventId,
        req.user.id,
        req.body.text
      );
      res.status(201).json(msg);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  // DELETE /api/events/:eventId/members/:userId
  async kickEventMember(req, res) {
    try {
      const result = await chatSvc.kickMember(
        +req.params.eventId,
        +req.params.userId
      );
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
};
