// src/controllers/userController.js
const userService = require('../services/userService');
const User        = require('../models/User');
const Role        = require('../models/Role');

module.exports = {
  /** 
   * Получение профиля текущего пользователя 
   */
  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.user.id);
      // Здесь user уже возвращён с ролями и именами полей в camelCase (snakeCaseMappers)
      return res.json(user);
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  },

  /** 
   * Обновление профиля текущего пользователя 
   */
  async updateProfile(req, res) {
    try {
      // 1) Берём поля из формы (multipart/form-data)
      const data = { ...req.body }; 
      // Пример: data = { name: 'Руслан', roles: '["Driver"]', /* ... */ }

      // 2) Если пришёл файл, формируем поле photoUrl
      if (req.file) {
        data.photoUrl = `/uploads/${req.file.filename}`;
      }

      // 3) Если пришли роли как JSON-строка, парсим в массив
      if (data.roles && typeof data.roles === 'string') {
        try {
          data.roles = JSON.parse(data.roles); // → ['Driver']
        } catch (e) {
          // если JSON.parse упал, оставляем data.roles как было
        }
      }

      // 4) Ставим флаг isDriver, если среди ролей есть 'Driver'
      data.isDriver = Array.isArray(data.roles) && data.roles.includes('Driver');

      // 5) Вызываем сервис, который внутри правильно конвертирует поля и обновляет связи
      const updatedUser = await userService.updateProfile(req.user.id, data);

      // 6) Возвращаем клиенту объект user с ролями, уже в camelCase
      return res.json(updatedUser);

    } catch (err) {
      console.error('*** updateProfile error:', err);
      return res.status(400).json({ message: err.message });
    }
  }
};
