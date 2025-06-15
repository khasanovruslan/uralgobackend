// src/controllers/admin/usersController.js
const usersSvc = require('../../services/admin/usersService');
const Role     = require('../../models/Role');

function sanitizeUser(u) {
  return {
    id:            u.id,
    fullName:      u.fullName,
    email:         u.email,
    phone:         u.phone,
    city:          u.city,
    birthDate:     u.birthDate,
    isDriver:      u.isDriver,
    driverLicense: u.driverLicense,
    photoUrl:      u.photoUrl,
    avatarUrl:     u.avatarUrl,
    roles:         u.roles.map(r => typeof r === 'string' ? r : r.name),
  };
}

module.exports = {
  // GET /api/admin/users
  async list(req, res, next) {
    try {
      // получаем пользователей вместе с ролями
      const us = await usersSvc.list();
      // чистим и сериализуем
      const safe = us.map(sanitizeUser);
      res.json(safe);
    } catch (e) {
      next(e);
    }
  },

  // GET /api/admin/users/:id
  async get(req, res, next) {
    try {
      const u = await usersSvc.getById(req.params.id);
      if (!u) return res.status(404).json({ message: 'Пользователь не найден' });
      res.json(sanitizeUser(u));
    } catch (e) {
      next(e);
    }
  },

  // POST /api/admin/users
  async create(req, res, next) {
    try {
      // извлекаем роли, остальное пойдет в создание
      const { roles = [], ...data } = req.body;
      // создаем пользователя
      const user = await usersSvc.create(data);

      // связываем роли, если переданы
      if (roles.length > 0) {
        const roleRecs = await Role.query().whereIn('name', roles);
        const ids = roleRecs.map(r => r.id);
        await user.$relatedQuery('roles').relate(ids);
      }

      // подгружаем роли заново
      const u = await usersSvc.getById(user.id);
      res.status(201).json(sanitizeUser(u));
    } catch (e) {
      next(e);
    }
  },

  // PUT /api/admin/users/:id
  async update(req, res, next) {
    try {
      const { roles, ...data } = req.body;

      // обновляем базовые поля
      const user = await usersSvc.update(req.params.id, data);
      if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

      // если переданы роли — сбросить и установить новые
      if (Array.isArray(roles)) {
        // отвязываем все
        await user.$relatedQuery('roles').unrelate();
        if (roles.length > 0) {
          const roleRecs = await Role.query().whereIn('name', roles);
          const ids = roleRecs.map(r => r.id);
          await user.$relatedQuery('roles').relate(ids);
        }
      }

      // вернуть с актуальными ролями
      const u = await usersSvc.getById(user.id);
      res.json(sanitizeUser(u));
    } catch (e) {
      next(e);
    }
  },

  // DELETE /api/admin/users/:id
  async delete(req, res, next) {
    try {
      await usersSvc.delete(req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
};

