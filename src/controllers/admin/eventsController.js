// src/controllers/admin/eventsController.js
const svc = require('../../services/admin/eventsService');

module.exports = {
  async list(req, res, next) {
    try {
      res.json(await svc.list());
    } catch (e) { next(e) }
  },

  async get(req, res, next) {
    try {
      const ev = await svc.getById(req.params.id);
      if (!ev) return res.status(404).json({ message: 'Событие не найдено' });
      res.json(ev);
    } catch (e) { next(e) }
  },

  async create(req, res, next) {
    try {
      const ev = await svc.create(req.body);
      res.status(201).json(ev);
    } catch (e) { next(e) }
  },

  async update(req, res, next) {
    try {
      const ev = await svc.update(req.params.id, req.body);
      res.json(ev);
    } catch (e) { next(e) }
  },

  async delete(req, res, next) {
    try {
      await svc.delete(req.params.id);
      res.status(204).end();
    } catch (e) { next(e) }
  },
};
