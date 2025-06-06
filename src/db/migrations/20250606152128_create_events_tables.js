// File: migrations/<timestamp>_create_events_tables.js

/**
 * 1) Таблица events:
 *    - id          (PK, serial)
 *    - type        (string, not null)          // например, 'Beer', 'Tour', 'Run'
 *    - title       (string, not null)
 *    - map_point   (point/geometry OR text, not null)
 *                   // хранить координаты: 'POINT(lat lng)' или просто 'lat,lng'
 *    - owner_id    (FK → users.id)
 *    - created_at  (timestamp with tz, default now())
 *
 *    // Дополнительно можно: description, starts_at, ends_at, max_members и т.п.
 *
 * 2) Таблица event_members:
 *    - event_id    (FK → events.id)
 *    - user_id     (FK → users.id)
 *    - status      (enum: pending, confirmed, canceled; default 'pending')
 *    - joined_at   (timestamp with tz, default now())
 *    PK составной: (event_id, user_id)
 */

exports.up = async function (knex) {
  // 1) Create table events
  const hasEvents = await knex.schema.hasTable('events');
  if (!hasEvents) {
    await knex.schema.createTable('events', (table) => {
      table.increments('id').primary();

      table.string('type', 50).notNullable();
      table.string('title', 255).notNullable();

      // Храним координаты в виде двух колонок: lat, lng
      table.decimal('latitude', 9, 6).notNullable();
      table.decimal('longitude', 9, 6).notNullable();

      table.integer('owner_id').unsigned().notNullable();
      table
        .foreign('owner_id')
        .references('users.id')
        .onDelete('CASCADE');

      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  }

  // 2) Create table event_members
  const hasEvMem = await knex.schema.hasTable('event_members');
  if (!hasEvMem) {
    await knex.schema.createTable('event_members', (table) => {
      table.integer('event_id').unsigned().notNullable();
      table
        .foreign('event_id')
        .references('events.id')
        .onDelete('CASCADE');

      table.integer('user_id').unsigned().notNullable();
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE');

      table
        .enu('status', ['pending', 'confirmed', 'canceled'], {
          useNative: true,
          enumName: 'event_member_status_enum',
        })
        .notNullable()
        .defaultTo('pending');

      table
        .timestamp('joined_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

      table.primary(['event_id', 'user_id'], 'ev_mem_pk');
    });
  }
};

exports.down = async function (knex) {
  const hasEvMem = await knex.schema.hasTable('event_members');
  if (hasEvMem) {
    await knex.schema.dropTable('event_members');
    await knex.schema.raw('DROP TYPE IF EXISTS "event_member_status_enum"');
  }

  const hasEvents = await knex.schema.hasTable('events');
  if (hasEvents) {
    await knex.schema.dropTable('events');
  }
};
