// File: src/config/socket.js
const { Server } = require('socket.io');

/**
 * Инициализация WebSocket-соединения для чата
 * @param {http.Server} server - HTTP сервер Express
 */
function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    // Подписаться на комнату (путешествие)
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`➡️ Socket ${socket.id} joined room ${roomId}`);
    });

    // Покинуть комнату
    socket.on('leaveRoom', ({ roomId }) => {
      socket.leave(roomId);
      console.log(`⬅️ Socket ${socket.id} left room ${roomId}`);
    });

    // Прием и ретрансляция сообщений в комнате
    socket.on('sendMessage', ({ roomId, senderId, message }) => {
      const payload = {
        roomId,
        senderId,
        message,
        timestamp: new Date().toISOString(),
      };
      io.to(roomId).emit('receiveMessage', payload);
      console.log(`📝 Message from ${senderId} in room ${roomId}: ${message}`);
    });

    // Обработка отключения клиента
    socket.on('disconnect', (reason) => {
      console.log(`🔴 Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });
}

module.exports = initSocket;
