// migrations/20250608111223_drop_initial_passengers_from_trips.js

exports.up = function(knex) {
  return knex.schema.alterTable('trips', table => {
    table.dropColumn('initial_passengers');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('trips', table => {
    table.integer('initial_passengers').notNullable().defaultTo(0);
  });
};
