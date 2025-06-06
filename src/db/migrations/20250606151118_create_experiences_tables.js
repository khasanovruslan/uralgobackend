/**
 * 1) Таблица `experiences`:
 *    - id               (PK)
 *    - creator_id       (FK → users.id)
 *    - title            (string, not null)
 *    - description      (text, nullable)
 *    - location         (string, not null)            // например, «ул. Пушкина, 10»
 *    - start_time       (timestamp, not null)
 *    - end_time         (timestamp, nullable)
 *    - max_participants (integer, not null, default 10)
 *    - created_at       (timestamp with tz, default now())
 *    - updated_at       (timestamp with tz, default now())
 *
 * 2) Таблица `experience_participants` (m:n связь):
 *    - experience_id    (FK → experiences.id)
 *    - user_id          (FK → users.id)
 *    - joined_at        (timestamp with tz, default now())
 *    PK составной: (experience_id, user_id)
 */

exports.up = async function (knex) {
  // 1) Создаём таблицу experiences
  const hasExperiences = await knex.schema.hasTable('experiences');
  if (!hasExperiences) {
    await knex.schema.createTable('experiences', (table) => {
      table.increments('id').primary();

      table.integer('creator_id').unsigned().notNullable();
      table
        .foreign('creator_id')
        .references('users.id')
        .onDelete('CASCADE');

      table.string('title', 255).notNullable();
      table.text('description').nullable();
      table.string('location', 255).notNullable();
      table
        .timestamp('start_time', { useTz: true })
        .notNullable();
      table
        .timestamp('end_time', { useTz: true })
        .nullable();
      table.integer('max_participants').notNullable().defaultTo(10);

      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .timestamp('updated_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  }

  // 2) Создаём таблицу experience_participants
  const hasExpPart = await knex.schema.hasTable('experience_participants');
  if (!hasExpPart) {
    await knex.schema.createTable('experience_participants', (table) => {
      table.integer('experience_id').unsigned().notNullable();
      table
        .foreign('experience_id')
        .references('experiences.id')
        .onDelete('CASCADE');

      table.integer('user_id').unsigned().notNullable();
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE');

      table
        .timestamp('joined_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());

      table.primary(['experience_id', 'user_id'], 'exp_part_pk');
    });
  }
};

exports.down = async function (knex) {
  const hasExpPart = await knex.schema.hasTable('experience_participants');
  if (hasExpPart) {
    await knex.schema.dropTable('experience_participants');
  }

  const hasExperiences = await knex.schema.hasTable('experiences');
  if (hasExperiences) {
    await knex.schema.dropTable('experiences');
  }
};
