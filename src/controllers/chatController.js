// File: src/controllers/chatController.js
// Простой HTTP-API для истории чатов (основная логика через WebSocket)
const messagesMap = {};

module.exports = {
  /** Получение истории сообщений для комнаты */
  async getMessages(req, res) {
    const { roomId } = req.query;
    if (!roomId) {
      return res.status(400).json({ message: 'Не указан roomId' });
    }
    res.json(messagesMap[roomId] || []);
  },

  /** Отправка сообщения через HTTP (WebSocket используется на клиенте)
   * Пример использования: POST /api/chat
   */
  async postMessage(req, res) {
    const { roomId, senderId, message } = req.body;
    if (!roomId || !senderId || !message) {
      return res.status(400).json({ message: 'Неполные данные сообщения' });
    }
    const payload = {
      senderId,
      message,
      timestamp: new Date().toISOString(),
    };
    if (!messagesMap[roomId]) messagesMap[roomId] = [];
    messagesMap[roomId].push(payload);
    res.status(201).json(payload);
  }
};
