// File: migrations/20250607_add_constraints_and_types_clean.js

exports.up = async function(knex) {
  // 1) Создание ENUM-типов
  await knex.raw(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trip_status_enum') THEN
        CREATE TYPE trip_status_enum AS ENUM ('planned','in_progress','finished','canceled');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status_enum') THEN
        CREATE TYPE booking_status_enum AS ENUM ('pending','confirmed','canceled');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_member_status_enum') THEN
        CREATE TYPE event_member_status_enum AS ENUM ('pending','accepted','rejected');
      END IF;
    END$$;
  `);

  // 2) users_roles
  //    — composite PK + FK на users и roles
  //    (предполагаем, что самой таблицы users_roles сейчас нет ограничений PK и FK)
  await knex.schema.alterTable('users_roles', table => {

    table
      .foreign('user_id', 'users_roles_user_id_fkey')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table
      .foreign('role_id', 'users_roles_role_id_fkey')
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  // 3) trips: PK(id) и FK(creator_id → users)
  await knex.schema.alterTable('trips', table => {

    table
      .foreign('creator_id', 'trips_creator_id_fkey')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });

  // 4) bookings: PK(id), FK(user_id → users), FK(trip_id → trips)
  await knex.schema.alterTable('bookings', table => {

    table
      .foreign('user_id', 'bookings_user_id_fkey')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table
      .foreign('trip_id', 'bookings_trip_id_fkey')
      .references('id')
      .inTable('trips')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  // 5) experiences: PK(id), FK(creator_id → users)
  await knex.schema.alterTable('experiences', table => {

    table
      .foreign('creator_id', 'experiences_creator_id_fkey')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  // 6) experience_participants: composite PK, FK(experience_id), FK(user_id)
  await knex.schema.alterTable('experience_participants', table => {

    table
      .foreign('experience_id', 'exp_participants_exp_id_fkey')
      .references('id')
      .inTable('experiences')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table
      .foreign('user_id', 'exp_participants_user_id_fkey')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  // 7) events: PK(id), FK(owner_id → users), добавляем description
  await knex.schema.alterTable('events', table => {

    table
      .foreign('owner_id', 'events_owner_id_fkey')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    // Если колонки description НЕ существует — добавляем
    table.text('description').nullable();
  });

  // 8) event_members: composite PK, FK(event_id), FK(user_id)
  await knex.schema.alterTable('event_members', table => {

    table
      .foreign('event_id', 'event_members_event_id_fkey')
      .references('id')
      .inTable('events')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table
      .foreign('user_id', 'event_members_user_id_fkey')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });

  // 9) Создание таблиц чатов в случае их отсутствия:
  //    вместо createTableIfNotExists — проверяем hasTable
  if (!(await knex.schema.hasTable('event_chats'))) {
    await knex.schema.createTable('event_chats', table => {
      table.increments('id').primary();
      table
        .integer('event_id')
        .notNullable()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
  }

  if (!(await knex.schema.hasTable('event_chat_messages'))) {
    await knex.schema.createTable('event_chat_messages', table => {
      table.increments('id').primary();
      table
        .integer('chat_id')
        .notNullable()
        .references('id')
        .inTable('event_chats')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.text('text').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
  }

  if (!(await knex.schema.hasTable('private_chats'))) {
    await knex.schema.createTable('private_chats', table => {
      table.increments('id').primary();
      table
        .integer('user1_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('user2_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.unique(['user1_id', 'user2_id'], 'private_chats_unique_pair');
    });
  }

  if (!(await knex.schema.hasTable('private_messages'))) {
    await knex.schema.createTable('private_messages', table => {
      table.increments('id').primary();
      table
        .integer('chat_id')
        .notNullable()
        .references('id')
        .inTable('private_chats')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('sender_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.text('text').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
  }
};


exports.down = async function(knex) {
  // ОБРАТНЫЙ ОТКАТ (упрощенный / без проверок):
  // Если вам не нужен полноценный "down", можно оставить пустым. 
  // Ниже пример удаления тех объектов, что мы точно создали в up.

  // 1) Чаты
  await knex.schema.dropTableIfExists('private_messages');
  await knex.schema.dropTableIfExists('private_chats');
  await knex.schema.dropTableIfExists('event_chat_messages');
  await knex.schema.dropTableIfExists('event_chats');

  // 2) Убираем ограничения из event_members
  await knex.schema.alterTable('event_members', table => {
    table.dropForeign('user_id', 'event_members_user_id_fkey');
    table.dropForeign('event_id', 'event_members_event_id_fkey');
  });


  // 3) Удаляем поле description и FK/PK из events
  await knex.schema.alterTable('events', table => {
    table.dropColumn('description');
    table.dropForeign('owner_id', 'events_owner_id_fkey');
  });

  // 4) experience_participants
  await knex.schema.alterTable('experience_participants', table => {
    table.dropForeign('user_id', 'exp_participants_user_id_fkey');
    table.dropForeign('experience_id', 'exp_participants_exp_id_fkey');
  });

  // 5) experiences
  await knex.schema.alterTable('experiences', table => {
    table.dropForeign('creator_id', 'experiences_creator_id_fkey');
  });

  // 6) bookings
  await knex.schema.alterTable('bookings', table => {
    table.dropForeign('user_id', 'bookings_user_id_fkey');
    table.dropForeign('trip_id', 'bookings_trip_id_fkey');
  });

  // 7) trips
  await knex.schema.alterTable('trips', table => {
    table.dropForeign('creator_id', 'trips_creator_id_fkey');
  });

  // 8) users_roles
  await knex.schema.alterTable('users_roles', table => {
    table.dropForeign('role_id', 'users_roles_role_id_fkey');
    table.dropForeign('user_id', 'users_roles_user_id_fkey');
  });
};
