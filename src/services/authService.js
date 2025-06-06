// File: src/services/authService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const User = require('../models/User');
const Role = require('../models/Role');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES_DAYS = 30;

// Генерация Access Token с payload { userId, roles }
function generateAccess(user) {
  return jwt.sign(
    {
      userId: user.id,
      roles: user.roles.map(r => r.name),
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

function genRefresh() {
  return crypto.randomBytes(64).toString('hex');
}

function refreshExpiry() {
  return new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
}

module.exports = {
  // РЕГИСТРАЦИЯ
  async register(data) {
    // 1. Проверяем, не занят ли email
    const existing = await User.query().findOne({ email: data.email });
    if (existing) {
      throw new Error('Такой email уже зарегистрирован');
    }

    // 2. Хэшируем пароль
    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

    // 3. Создаём пользователя через Objection напрямую
    //    (здесь мы ожидаем, что вернётся созданный объект с id)
    const user = await User.query().insert({
      fullName: data.fullName,
      email: data.email,
      password: hashed,
      phone: data.phone || null,
      city: data.city || null,
      birthDate: data.birthDate || null,
      passport: data.passport || null,
      isDriver: data.isDriver || false,
      driverLicense: data.driverLicense || null,
      photoUrl: data.photoUrl || null,
    });

    // 4. Назначаем роль “User” по умолчанию
    const baseRole = await Role.query().findOne({ name: 'User' });
    if (!baseRole) {
      throw new Error('Роль User не найдена в базе');
    }
    await user.$relatedQuery('roles').relate(baseRole.id);

    // Подгружаем роли (чтобы сразу в generateAccess были данные)
    user.roles = [baseRole];

    // 5. Генерируем токены
    const accessToken = generateAccess(user);
    const refreshToken = genRefresh();

    // 6. Сохраняем refresh-token в БД
    await db('refresh_tokens').insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: refreshExpiry(),
      ip_address: '',    // можно добавить реальный IP в будущем
      user_agent: '',    // можно добавить реальный User-Agent
    });

    // 7. Возвращаем клиенту user (без password благодаря $formatJson) и токены
    return { user, token: accessToken, refreshToken };
  },

  // ЛОГИН
  async login({ email, password }) {
    // 1. Находим пользователя по email
    const user = await User.query().findOne({ email });
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    // 2. Сравниваем пароль
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Неверный email или пароль');
    }

    // 3. Подгружаем роли пользователя
    const roles = await user.$relatedQuery('roles');
    user.roles = roles;

    // 4. Генерируем токены
    const accessToken = generateAccess(user);
    const refreshToken = genRefresh();

    // 5. Сохраняем refresh-token в БД
    await db('refresh_tokens').insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: refreshExpiry(),
      ip_address: '',
      user_agent: '',
    });

    // 6. Возвращаем клиенту user и токены
    return { user, token: accessToken, refreshToken };
  },

  // РЕФРЕШ
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh-token не передан');
    }

    // 1. Ищем запись в таблице refresh_tokens
    const rec = await db('refresh_tokens').where({ token: refreshToken }).first();
    if (!rec) {
      throw new Error('Невалидный refresh-token');
    }
    if (new Date(rec.expires_at) < new Date()) {
      throw new Error('Refresh-token истёк');
    }

    // 2. Ищем пользователя по rec.user_id
    const user = await User.query().findById(rec.user_id);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // 3. Подгружаем роли
    const roles = await user.$relatedQuery('roles');
    user.roles = roles;

    // 4. Генерируем новый accessToken
    const newAccess = generateAccess(user);
    return { token: newAccess, user };
  },

  // ЛОУГ-АУТ (удаление refresh-token из БД)
  async logout(refreshToken) {
    if (!refreshToken) {
      return; // просто выходим, если токена нет
    }
    await db('refresh_tokens').where({ token: refreshToken }).del();
  },
};
