// File: src/db/migrations/<timestamp>_alter_trips_add_missing_columns.js

/**
 * Добавляем в таблицу `trips` все недостающие колонки (snake_case),
 * которые требует модель Trip и репозиторий.
 */

exports.up = async function(knex) {
  // 1) Добавляем creator_id, если ещё нет (модель ожидает creatorId → snake_case creator_id)
  const hasCreatorId = await knex.schema.hasColumn('trips', 'creator_id');
  if (!hasCreatorId) {
    await knex.schema.alterTable('trips', table => {
      table.integer('creator_id').notNullable().references('id').inTable('users');
    });
  }

  // 2) Добавляем поля origin, destination, departure_time, seats (скорее всего они уже есть,
  //    но проверим, чтобы не ломать миграции при повторном запуске):
  const hasOrigin = await knex.schema.hasColumn('trips', 'origin');
  if (!hasOrigin) {
    await knex.schema.alterTable('trips', table => {
      table.string('origin', 255).notNullable();
    });
  }

  const hasDestination = await knex.schema.hasColumn('trips', 'destination');
  if (!hasDestination) {
    await knex.schema.alterTable('trips', table => {
      table.string('destination', 255).notNullable();
    });
  }

  const hasDepartureTime = await knex.schema.hasColumn('trips', 'departure_time');
  if (!hasDepartureTime) {
    await knex.schema.alterTable('trips', table => {
      table.timestamp('departure_time', { useTz: true }).notNullable();
    });
  }

  const hasSeats = await knex.schema.hasColumn('trips', 'seats');
  if (!hasSeats) {
    await knex.schema.alterTable('trips', table => {
      table.integer('seats').notNullable().defaultTo(1);
    });
  }

  // 3) Добавляем available_seats (модель рассчитывает при вставке, но хранить нужно):
  const hasAvailableSeats = await knex.schema.hasColumn('trips', 'available_seats');
  if (!hasAvailableSeats) {
    await knex.schema.alterTable('trips', table => {
      table.integer('available_seats').notNullable().defaultTo(0);
    });
  }

  // 4) Добавляем initial_passengers:
  const hasInitialPassengers = await knex.schema.hasColumn('trips', 'initial_passengers');
  if (!hasInitialPassengers) {
    await knex.schema.alterTable('trips', table => {
      table.integer('initial_passengers').notNullable().defaultTo(0);
    });
  }

  // 5) Добавляем allow_booking:
  const hasAllowBooking = await knex.schema.hasColumn('trips', 'allow_booking');
  if (!hasAllowBooking) {
    await knex.schema.alterTable('trips', table => {
      table.boolean('allow_booking').notNullable().defaultTo(true);
    });
  }

  // 6) Добавляем price:
  const hasPrice = await knex.schema.hasColumn('trips', 'price');
  if (!hasPrice) {
    await knex.schema.alterTable('trips', table => {
      table.decimal('price').nullable();
    });
  }

  // 7) Добавляем description:
  const hasDescription = await knex.schema.hasColumn('trips', 'description');
  if (!hasDescription) {
    await knex.schema.alterTable('trips', table => {
      table.text('description').nullable();
    });
  }

  // 8) Добавляем геокоординаты origin_lat, origin_lng, destination_lat, destination_lng:
  const hasOriginLat = await knex.schema.hasColumn('trips', 'origin_lat');
  if (!hasOriginLat) {
    await knex.schema.alterTable('trips', table => {
      table.decimal('origin_lat', 9, 6).nullable();
    });
  }
  const hasOriginLng = await knex.schema.hasColumn('trips', 'origin_lng');
  if (!hasOriginLng) {
    await knex.schema.alterTable('trips', table => {
      table.decimal('origin_lng', 9, 6).nullable();
    });
  }
  const hasDestinationLat = await knex.schema.hasColumn('trips', 'destination_lat');
  if (!hasDestinationLat) {
    await knex.schema.alterTable('trips', table => {
      table.decimal('destination_lat', 9, 6).nullable();
    });
  }
  const hasDestinationLng = await knex.schema.hasColumn('trips', 'destination_lng');
  if (!hasDestinationLng) {
    await knex.schema.alterTable('trips', table => {
      table.decimal('destination_lng', 9, 6).nullable();
    });
  }

  // 9) Добавляем статус (planned / in_progress / finished / canceled)
  const hasStatus = await knex.schema.hasColumn('trips', 'status');
  if (!hasStatus) {
    await knex.schema.alterTable('trips', table => {
      table
        .enu('status', ['planned', 'in_progress', 'finished', 'canceled'])
        .notNullable()
        .defaultTo('planned');
    });
  }

  // 10) Добавляем created_at, updated_at
  const hasCreatedAt = await knex.schema.hasColumn('trips', 'created_at');
  if (!hasCreatedAt) {
    await knex.schema.alterTable('trips', table => {
      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  } else {
    // Если колонка уже есть, задаём default now (если не задан)
    await knex.raw(`
      ALTER TABLE trips
      ALTER COLUMN created_at SET DEFAULT now()
    `);
  }

  const hasUpdatedAt = await knex.schema.hasColumn('trips', 'updated_at');
  if (!hasUpdatedAt) {
    await knex.schema.alterTable('trips', table => {
      table
        .timestamp('updated_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  } else {
    await knex.raw(`
      ALTER TABLE trips
      ALTER COLUMN updated_at SET DEFAULT now()
    `);
  }
};

exports.down = async function(knex) {
  // Откат: удаляем добавленные столбцы (по порядку)
  await knex.schema.alterTable('trips', async table => {
    if (await knex.schema.hasColumn('trips', 'destination_lng')) {
      table.dropColumn('destination_lng');
    }
    if (await knex.schema.hasColumn('trips', 'destination_lat')) {
      table.dropColumn('destination_lat');
    }
    if (await knex.schema.hasColumn('trips', 'origin_lng')) {
      table.dropColumn('origin_lng');
    }
    if (await knex.schema.hasColumn('trips', 'origin_lat')) {
      table.dropColumn('origin_lat');
    }
    if (await knex.schema.hasColumn('trips', 'description')) {
      table.dropColumn('description');
    }
    if (await knex.schema.hasColumn('trips', 'price')) {
      table.dropColumn('price');
    }
    if (await knex.schema.hasColumn('trips', 'allow_booking')) {
      table.dropColumn('allow_booking');
    }
    if (await knex.schema.hasColumn('trips', 'initial_passengers')) {
      table.dropColumn('initial_passengers');
    }
    if (await knex.schema.hasColumn('trips', 'available_seats')) {
      table.dropColumn('available_seats');
    }
    if (await knex.schema.hasColumn('trips', 'seats')) {
      table.dropColumn('seats');
    }
    if (await knex.schema.hasColumn('trips', 'departure_time')) {
      table.dropColumn('departure_time');
    }
    if (await knex.schema.hasColumn('trips', 'destination')) {
      table.dropColumn('destination');
    }
    if (await knex.schema.hasColumn('trips', 'origin')) {
      table.dropColumn('origin');
    }
    if (await knex.schema.hasColumn('trips', 'creator_id')) {
      table.dropColumn('creator_id');
    }
    if (await knex.schema.hasColumn('trips', 'status')) {
      table.dropColumn('status');
    }
    if (await knex.schema.hasColumn('trips', 'created_at')) {
      table.dropColumn('created_at');
    }
    if (await knex.schema.hasColumn('trips', 'updated_at')) {
      table.dropColumn('updated_at');
    }
  });
};
