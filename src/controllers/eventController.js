// File: src/controllers/eventController.js

const eventService = require('../services/eventService');

module.exports = {

  async listCreated(req, res) {
  try {
    const ownerId = req.user.id;
    const events = await eventService.listCreated(ownerId);
    return res.json(events);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
},

async listJoined(req, res) {
  try {
    const userId = req.user.id;
    const events = await eventService.listJoined(userId);
    return res.json(events);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
},
  // POST /api/events
  async createEvent(req, res) {
    try {
      const ownerId = req.user.id;

      // Извлекаем все поля из form-data
      const {
        type,
        title,
        description,
        address,
        startTime,
        endTime,
        maxParticipants,
        category,
        tags,
        latitude,
        longitude,
      } = req.body;

      // Приводим координаты и числа
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const maxP = maxParticipants != null
        ? parseInt(maxParticipants, 10)
        : null;

      // Разбираем теги (они приходят как JSON-строка)
      let tagsArr = null;
      if (tags) {
        try {
          tagsArr = JSON.parse(tags);
        } catch {
          tagsArr = tags.split(',').map(t => t.trim());
        }
      }

      // Формируем URL загруженного файла, если он есть
      // Предположим, что multer сохраняет его в /uploads и оставляет req.file.filename
      const imageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      // Собираем объект для сервиса
      const data = {
        type,
        title,
        description: description || null,
        address: address || null,
        startTime: startTime || null,
        endTime:   endTime   || null,
        maxParticipants: maxP,
        category:  category || null,
        tags:      tagsArr,
        latitude:  lat,
        longitude: lng,
        imageUrl,
      };

      // Вызываем сервис
      const ev = await eventService.createEvent(ownerId, data);
      return res.status(201).json(ev);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
 // GET /api/events
  async listEvents(req, res) {
    try {
      const { bbox } = req.query;
      const params = {};
      if (bbox) {
        params.bbox = bbox.split(',').map(parseFloat);
      }
      const events = await eventService.listEvents(params);
      res.json(events);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  // GET /api/events/:id
  async getEvent(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const ev = await eventService.getEvent(id);
      res.json(ev);
    } catch (e) {
      res.status(404).json({ message: e.message });
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
