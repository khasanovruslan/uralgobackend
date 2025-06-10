// migrations/20250608184934_drop_available_seats.js
exports.up = function(knex) {
  return knex.schema.table('trips', table => {
    table.dropColumn('available_seats');
  });
};

exports.down = function(knex) {
  return knex.schema.table('trips', table => {
    table.integer('available_seats').notNullable().defaultTo(0);
  });
};
