// File: migrations/<timestamp>_create_trip_messages_table.js

/**
 * Таблица trip_messages:
 * - id           (PK)
 * - trip_id      (FK → trips.id)
 * - user_id      (FK → users.id)
 * - content      (text, not null)
 * - created_at   (timestamp with tz, default now)
 */

exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('trip_messages');
  if (!exists) {
    await knex.schema.createTable('trip_messages', (table) => {
      table.increments('id').primary();

      table.integer('trip_id').unsigned().notNullable();
      table
        .foreign('trip_id')
        .references('trips.id')
        .onDelete('CASCADE');

      table.integer('user_id').unsigned().notNullable();
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE');

      table.text('content').notNullable();

      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable('trip_messages');
  if (exists) {
    await knex.schema.dropTableIfExists('trip_messages');
  }
};
