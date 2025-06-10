// File: migrations/<timestamp>_create_bookings_table.js

/**
 * Таблица bookings:
 * - id               (PK)
 * - user_id          (FK → users.id)
 * - trip_id          (FK → trips.id)
 * - seats_reserved   (integer, not null)
 * - status           (enum: pending, confirmed, canceled)
 * - created_at, updated_at (timestamps)
 */

exports.up = async function (knex) {
  const has = await knex.schema.hasTable('bookings');
  if (!has) {
    await knex.schema.createTable('bookings', (table) => {
      table.increments('id').primary();

      table.integer('user_id').unsigned().notNullable();
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE');

      table.integer('trip_id').unsigned().notNullable();
      table
        .foreign('trip_id')
        .references('trips.id')
        .onDelete('CASCADE');

      table.integer('seats_reserved').notNullable().defaultTo(1);

      table
        .enu('status', ['pending', 'confirmed', 'canceled'], {
          useNative: true,
          enumName: 'booking_status_enum',
        })
        .notNullable()
        .defaultTo('pending');

      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .timestamp('updated_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

      // Чтобы пользователь не забронировал одну и ту же поездку дважды
      table.unique(['user_id', 'trip_id'], 'booking_user_trip_unique');
    });
  }
};

exports.down = async function (knex) {
  const has = await knex.schema.hasTable('bookings');
  if (has) {
    await knex.schema.dropTableIfExists('bookings');
    // После удаления таблицы удалим enum-тип
    await knex.schema.raw('DROP TYPE IF EXISTS "booking_status_enum"');
  }
};
