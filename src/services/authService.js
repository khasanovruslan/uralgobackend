// File: src/services/authService.js
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const userRepo = require('../repositories/userRepo');
const Role = require('../models/Role');

const SALT_ROUNDS    = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

module.exports = {
  async register(userData) {
    // 1) проверка уникальности email
    const existing = await userRepo.findByEmail(userData.email);
    if (existing) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // 2) хэшируем пароль
    const hashed = await bcrypt.hash(userData.password, SALT_ROUNDS);

    // 3) создаём пользователя (без ролей)
    const user = await userRepo.create({ ...userData, password: hashed });

   // 4) если в userData.roles есть роли — связываем их
   if (Array.isArray(userData.roles) && userData.roles.length) {
     const roles = await Role.query().whereIn('name', userData.roles);
     await user.$relatedQuery('roles').relate(roles.map(r => r.id));
     user.roles = roles;
   }

    // 5) генерируем JWT, вкладывая roles в payload
    const token = jwt.sign({
      userId: user.id,
     roles:  (user.roles || []).map(r => r.name)
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { user, token };
  },

  // login остаётся без изменений, кроме включения ролей в выдаваемом токене
  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('Неверный email или пароль');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Неверный email или пароль');

    // нужно подгрузить роли из БД
    const roles = await user.$relatedQuery('roles');

    const token = jwt.sign({
      userId: user.id,
      roles:  roles.map(r => r.name)
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { user, token };
  }
};
