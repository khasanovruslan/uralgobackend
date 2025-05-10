// File: src/db/seeds/001_users.js
require('dotenv').config();
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Очистить таблицу
  await knex('users').del();

  // Хэш пароля
  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
  const hashed = await bcrypt.hash('password123', saltRounds);

  // Вставить тестового пользователя
  await knex('users').insert([
    {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: hashed,
      phone: '1234567890',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};