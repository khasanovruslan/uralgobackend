// File: src/index.js
require('dotenv').config();
// Подключаем и инициализируем Objection  Knex
require('./config/db');

const express = require('express');
const http = require('http');
const cors = require('cors');
const path    = require('path');

const initSocket = require('./config/socket');

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Раздача папки uploads по URL /uploads
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '../uploads'))
);

// Health-check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/user',      require('./routes/user'));
app.use('/api/trips',     require('./routes/trips'));
app.use('/api/archive',   require('./routes/tripsArchive'));
app.use('/api/chat',      require('./routes/chat'));

// WebSocket
initSocket(server);

app.get('/', (req, res) => {
  res.send('Сервер работает!');
});


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
