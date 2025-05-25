// File: src/services/userService.js
const userRepo = require('../repositories/userRepo');
const Role     = require('../models/Role');
const User     = require('../models/User');

module.exports = {
  async getProfile(userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphFetched('roles');
    if (!user) throw new Error('Пользователь не найден');
    return user;
  },

  async updateProfile(userId, data) {
    // Если пришли роли — обновляем many-to-many
    if (Array.isArray(data.roles)) {
      const roles = await Role.query().whereIn('name', data.roles);
      await User.relatedQuery('roles').for(userId).unrelate();
      await User.relatedQuery('roles').for(userId).relate(roles.map(r => r.id));
    }

    // Удаляем поля, которые не хранятся в users напрямую
    delete data.roles;

    // Обновляем остальные поля (включая photoUrl)
    const updated = await userRepo.updateById(userId, data);
    return updated;
  }
};
