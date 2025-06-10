// src/services/userService.js
const userRepo = require('../repositories/userRepo');
const Role     = require('../models/Role');
const User     = require('../models/User');

module.exports = {
  async getProfile(userId) {
    // Возвращаем пользователя с ролями (camelCase за счёт snakeCaseMappers())
    const user = await User.query()
      .findById(userId)
      .withGraphFetched('roles');
    if (!user) throw new Error('Пользователь не найден');

    // Удалим приватные поля (пароль) перед отдачей клиенту
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
  },

  async updateProfile(userId, data) {
    //
    // data может содержать:
    //   { name, email, phone, birthDate, passport, driverLicense, photoUrl, isDriver, roles: [/*...*/] }
    //

    // 1) Сначала обновим «обычные» поля таблицы users
    //    Но нам нужно сконвертировать camelCase-поля в snake_case
    //    (т. е. isDriver → is_driver, driverLicense → driver_license, birthDate → birth_date, photoUrl → photo_url)

    const patchData = {};

    if (data.fullName !== undefined)     patchData.fullName           = data.fullName;
    if (data.email !== undefined)    patchData.email          = data.email;
    if (data.phone !== undefined)    patchData.phone          = data.phone;
    if (data.city !== undefined)     patchData.city           = data.city;
    if (data.birthDate !== undefined)    patchData.birth_date     = data.birthDate;
    if (data.passport !== undefined)     patchData.passport       = data.passport;
    if (data.driverLicense !== undefined) patchData.driver_license = data.driverLicense;
    if (data.photoUrl !== undefined)      patchData.photo_url      = data.photoUrl;
    if (data.isDriver !== undefined)      patchData.is_driver      = data.isDriver;

    // Если patchData пустой — нет полей для обновления, то skip обновление
    let updated;
    if (Object.keys(patchData).length) {
      updated = await userRepo.updateById(userId, patchData);
    } else {
      // Если нет «обычных» полей, просто загрузим пользователя (чтобы иметь его объект)
      updated = await User.query().findById(userId);
    }

    // 2) Теперь обновим связи many-to-many: «пользователь ←→ роли»
    //    Если пришло data.roles = ['Driver','Guide', ...], то обновим таблицу users_roles.

    if (Array.isArray(data.roles)) {
      // 2.1) Находим все роли (идентификаторы) по именам
      const roleRecords = await Role.query().whereIn('name', data.roles); 
      const roleIds = roleRecords.map(r => r.id);

      // 2.2) Сначала открепляем все старые связи
      await User.relatedQuery('roles').for(userId).unrelate();

      // 2.3) Затем прикрепляем новые
      if (roleIds.length) {
        await User.relatedQuery('roles').for(userId).relate(roleIds);
      }
    }

    // 3) В конце возвращаем уже «свежий» объект пользователя с ролями (camelCase благодаря snakeCaseMappers)
    const finalUser = await User.query()
      .findById(userId)
      .withGraphFetched('roles');

    // Снова уберём приватные поля
    delete finalUser.password;
    delete finalUser.createdAt;
    delete finalUser.updatedAt;

    return finalUser;
  }
};
