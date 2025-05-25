// File: src/controllers/userController.js
const path = require('path');
const userService = require('../services/userService');

module.exports = {
  /** Получение профиля текущего пользователя */
   // File: src/controllers/userController.js
async getProfile(req, res) {
  try {
    const user = await userService.getProfile(req.user.id);
    // Очищаем приватные поля
    const safe = { ...user };
    delete safe.password;
    delete safe.created_at;
    delete safe.updated_at;
    delete safe.is_driver;
    delete safe.driver_license;
    res.json(safe);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
},
   
     async updateProfile(req, res) {
    try {
      // Берём тело и файл из multer
      const data = { ...req.body };
      if (req.file) {
        data.photoUrl = `/uploads/${req.file.filename}`;
      }

      // Парсим роли из JSON-строки, если нужно
      if (data.roles && typeof data.roles === 'string') {
        try { data.roles = JSON.parse(data.roles); }
        catch (e) { /* если не JSON, оставляем как есть */ }
      }

      // Синхронизируем флаг isDriver:
      // если в списке ролей есть Driver — ставим isDriver=true
      data.isDriver = Array.isArray(data.roles) && data.roles.includes('Driver');

      // Вызываем сервис, обновляем профиль и роли
      const updated = await userService.updateProfile(req.user.id, data);

      // Собираем безопасный ответ
      res.json({
        id:            updated.id,
        name:          updated.name,
        email:         updated.email,
        phone:         updated.phone,
        city:          updated.city,
        birthDate:     updated.birthDate,
        passport:      updated.passport,
        driverLicense: updated.driverLicense,
        photoUrl:      updated.photoUrl,
        roles:         updated.roles, // убедитесь, что service возвращает roles
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  
};
