// seeds/XXXX_seed_roles.js

exports.seed = async function(knex) {
  // Очищаем таблицу и вставляем роли
  await knex('users_roles').del();
  await knex('roles').del();
  await knex('roles').insert([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Driver' },
    { id: 3, name: 'Passenger' },
    { id: 4, name: 'Guide' },
    { id: 5, name: 'Organizer' },
  ]);
};
