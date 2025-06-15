// File: src/index.js
require('dotenv').config();
// 1) Подключаем и инициализируем Objection/Knex
require('./config/db');
// 1.1) Регистрируем все модели Objection
require('./models');
require('./cron/archiveTrips');


const cookieParser = require('cookie-parser');
const express      = require('express');
const http         = require('http');
const cors         = require('cors');
const path         = require('path');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const geocodeRouter = require('./routes/geocode');
const geonamesRouter = require('./routes/geonames');
const initSocket   = require('./config/socket');

const app    = express();
const server = http.createServer(app);

// --- Новая секция: разбираем список разрешённых URL из .env
const allowedOrigins = (process.env.CLIENT_URLS || '')
  .split(',')
  .map(u => u.trim())
  .filter(u => u.length);

// Middlewares

// CORS: проверяем origin по массиву allowedOrigins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

const { contentSecurityPolicy, crossOriginResourcePolicy } = helmet;

// Helmet CSP: используем allowedOrigins в директивах
app.use(contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc:    ["'self'", "data:", ...allowedOrigins, "http://localhost:3000"],
    scriptSrc: ["'self'", ...allowedOrigins],
    styleSrc:  ["'self'", "'unsafe-inline'", "https:", ...allowedOrigins],
    // остальные директивы оставьте ваши
  }
}));

// позволим отдавать ресурсы с любого origin
app.use(crossOriginResourcePolicy({ policy: 'cross-origin' }));

// 1) Общий лимитер: 200 запросов за 10 минут на один IP
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 200,                 // максимум 200 запросов
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Слишком много запросов с вашего IP, попробуйте позже' },
});

// 2) Строгий лимитер для аутентификации: 5 попыток в минуту
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 минута
  max: 5,                   // максимум 5 запросов 
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Слишком много попыток входа/регистрации, пожалуйста, подождите минуту' },
});

// Применяем общий лимитер к всем маршрутам
app.use(generalLimiter);

app.use(express.json());
app.use(cookieParser());

const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use(
  '/uploads',
  cors({ origin: '*' }),         // даём любому клиенту доступ
  express.static(uploadsPath, {
    setHeaders(res, filePath) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  })
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
app.use('/api/events', require('./routes/events'));
app.use('/api/events/:eventId/chat', require('./routes/eventChat'));
app.use('/api/geocode', geocodeRouter);
app.use('/api/geonames', geonamesRouter);
app.use('/api', require('./routes/chatTrip'))
app.use('/api/admin', require('./routes/admin'));





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
