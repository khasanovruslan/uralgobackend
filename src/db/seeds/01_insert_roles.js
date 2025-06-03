// src/db/seeds/01_insert_roles.js
/**
 * Этот сид добавит в таблицу roles необходимые записи.
 */
exports.seed = async function(knex) {
    // 1) Удалим все существующие (на всякий случай)
    await knex('roles').del();
  
    // 2) Вставим нужные
    await knex('roles').insert([
      { id: 1, name: 'Driver' },
      { id: 2, name: 'Guide' },
      { id: 3, name: 'Organizer' }
    ]);
  };
  