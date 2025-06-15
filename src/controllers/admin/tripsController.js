// src/controllers/admin/tripsController.js
const svc = require('../../services/admin/tripsService');

module.exports = {
  async list(req, res, next) {
    try {
      const items = await svc.list();
      res.json(items);
    } catch (e) { next(e) }
  },

  async get(req, res, next) {
    try {
      const t = await svc.getById(req.params.id);
      if (!t) return res.status(404).json({ message: 'Не найдена поездка' });
      res.json(t);
    } catch (e) { next(e) }
  },

  async create(req, res, next) {
    try {
      const t = await svc.create(req.body);
      res.status(201).json(t);
    } catch (e) { next(e) }
  },

  async update(req, res, next) {
    try {
      const t = await svc.update(req.params.id, req.body);
      res.json(t);
    } catch (e) { next(e) }
  },

  async delete(req, res, next) {
    try {
      await svc.delete(req.params.id);
      res.status(204).end();
    } catch (e) { next(e) }
  },
};
