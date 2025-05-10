// File: src/db/seeds/002_trips.js
exports.seed = async function(knex) {
  // Очистить таблицу
  await knex('trips').del();

  // Вставить тестовую поездку
  await knex('trips').insert([
    {
      id: 1,
      creator_id: 1,
      origin: 'Moscow',
      destination: 'Saint Petersburg',
      departure_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // завтра
      seats: 3,
      price: 1500,
      description: 'Test trip from Moscow to Saint Petersburg',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};
