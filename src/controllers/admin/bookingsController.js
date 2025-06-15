// src/controllers/admin/bookingsController.js
const svc = require('../../services/admin/bookingsService');

module.exports = {
  async list(req, res, next) {
    try {
      res.json(await svc.list());
    } catch (e) { next(e) }
  },

  async get(req, res, next) {
    try {
      const b = await svc.getById(req.params.id);
      if (!b) return res.status(404).json({ message: 'Бронирование не найдено' });
      res.json(b);
    } catch (e) { next(e) }
  },

  async create(req, res, next) {
    try {
      const b = await svc.create(req.body);
      res.status(201).json(b);
    } catch (e) { next(e) }
  },

  async update(req, res, next) {
    try {
      const b = await svc.update(req.params.id, req.body);
      res.json(b);
    } catch (e) { next(e) }
  },

  async delete(req, res, next) {
    try {
      await svc.delete(req.params.id);
      res.status(204).end();
    } catch (e) { next(e) }
  },
};
