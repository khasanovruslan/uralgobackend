// File: src/index.js
require('dotenv').config();
// Подключаем и инициализируем Objection/Knex
require('./config/db');

const cookieParser = require('cookie-parser');
const express      = require('express');
const http         = require('http');
const cors         = require('cors');
const path         = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const geocodeRouter = require('./routes/geocode');


const initSocket = require('./config/socket');

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5174', // ваш фронтенд
    credentials: true, // без этого cookie не будут передаваться
  })
);

app.use(helmet());
// ===== Настройка rate limit =====

// 1) Общий лимитер: 200 запросов за 10 минут на один IP
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 200,                 // максимум 200 запросов
  standardHeaders: true,    // возвращает информацию в заголовках RateLimit-*
  legacyHeaders: false,     // не возвращаем X-RateLimit-* (только новые)
  message: { message: 'Слишком много запросов с вашего IP, попробуйте позже' },
});

// 2) Строгий лимитер для аутентификации: 5 попыток в минуту
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 5,                  // максимум 5 запросов 
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Слишком много попыток входа/регистрации, пожалуйста, подождите минуту' },
});

// Применяем общий лимитер к всем маршрутам
app.use(generalLimiter);

// Аутентификационный лимитер привяжем к маршрутам /api/auth/*

app.use(express.json());
app.use(cookieParser());

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
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/user',    require('./routes/user'));
app.use('/api/trips',   require('./routes/trips'));
app.use('/api/archive', require('./routes/tripsArchive'));
app.use('/api/chat',    require('./routes/chat'));
app.use('/api/bookings',require('./routes/bookings'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/events',      require('./routes/events'));
app.use('/api/geocode', geocodeRouter);

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
