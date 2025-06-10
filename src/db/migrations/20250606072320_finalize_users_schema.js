// File: src/db/migrations/20250606072320_finalize_users_schema.js

exports.up = async function (knex) {
  // 1) Переименование name → full_name (или создание full_name, если ни name, ни full_name нет)
  const hasName = await knex.schema.hasColumn('users', 'name');
  const hasFullName = await knex.schema.hasColumn('users', 'full_name');

  if (hasName && !hasFullName) {
    await knex.schema.alterTable('users', (table) => {
      table.renameColumn('name', 'full_name');
    });
  } else if (!hasName && !hasFullName) {
    await knex.schema.alterTable('users', (table) => {
      table.string('full_name', 255).notNullable().defaultTo('');
    });
  }

  // 2) Удаление camelCase-колонок isDriver и driverLicense
  const hasIsDriverCamel = await knex.schema.hasColumn('users', 'isDriver');
  if (hasIsDriverCamel) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('isDriver');
    });
  }

  const hasDriverLicenseCamel = await knex.schema.hasColumn('users', 'driverLicense');
  if (hasDriverLicenseCamel) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('driverLicense');
    });
  }

  // 3) Создание snake_case-колонок is_driver, driver_license (если нет)
  const hasIsDriver = await knex.schema.hasColumn('users', 'is_driver');
  if (!hasIsDriver) {
    await knex.schema.alterTable('users', (table) => {
      table.boolean('is_driver').notNullable().defaultTo(false);
    });
  }

  const hasDriverLicense = await knex.schema.hasColumn('users', 'driver_license');
  if (!hasDriverLicense) {
    await knex.schema.alterTable('users', (table) => {
      table.string('driver_license', 255).nullable();
    });
  }

  // 4) Добавление прочих колонок (city, birth_date, passport, photo_url, avatar_url)
  const hasCity = await knex.schema.hasColumn('users', 'city');
  if (!hasCity) {
    await knex.schema.alterTable('users', (table) => {
      table.string('city', 255).nullable();
    });
  }

  const hasBirthDate = await knex.schema.hasColumn('users', 'birth_date');
  if (!hasBirthDate) {
    await knex.schema.alterTable('users', (table) => {
      table.date('birth_date').nullable();
    });
  }

  const hasPassport = await knex.schema.hasColumn('users', 'passport');
  if (!hasPassport) {
    await knex.schema.alterTable('users', (table) => {
      table.string('passport', 50).nullable();
    });
  }

  const hasPhotoUrl = await knex.schema.hasColumn('users', 'photo_url');
  if (!hasPhotoUrl) {
    await knex.schema.alterTable('users', (table) => {
      table.string('photo_url', 512).nullable();
    });
  }

  const hasAvatarUrl = await knex.schema.hasColumn('users', 'avatar_url');
  if (!hasAvatarUrl) {
    await knex.schema.alterTable('users', (table) => {
      table.string('avatar_url', 512).nullable();
    });
  }

  // 5) Проверка/создание created_at и updated_at с дефолтами
  const hasCreatedAt = await knex.schema.hasColumn('users', 'created_at');
  if (!hasCreatedAt) {
    await knex.schema.alterTable('users', (table) => {
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
  } else {
    await knex.raw(`ALTER TABLE users ALTER COLUMN created_at SET DEFAULT now()`);
  }

  const hasUpdatedAt = await knex.schema.hasColumn('users', 'updated_at');
  if (!hasUpdatedAt) {
    await knex.schema.alterTable('users', (table) => {
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
  } else {
    await knex.raw(`ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT now()`);
  }

  // 6) Проверка и создание уникального индекса на email
  const result = await knex.raw(`SELECT to_regclass('public.users_email_unique') AS idx`);
  const idx = result.rows[0].idx;
  if (!idx) {
    await knex.schema.alterTable('users', (table) => {
      table.unique('email', 'users_email_unique');
    });
  }

  // 7) Переименование старого индекса на email, если он называется иначе
  await knex.raw(`
    DO $$
    DECLARE
      old_idx text;
    BEGIN
      SELECT indexname 
        INTO old_idx
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = 'users'
        AND indexdef LIKE '%UNIQUE%email%';

      IF old_idx IS NOT NULL AND old_idx <> 'users_email_unique' THEN
        EXECUTE format('ALTER INDEX %I RENAME TO users_email_unique', old_idx);
      END IF;
    END
    $$;
  `);
};

exports.down = async function (knex) {
  // 1) Удаляем уникальный индекс users_email_unique
  await knex.raw(`DROP INDEX IF EXISTS users_email_unique`);

  // 2) Удаляем колонки, проверяя наличие перед удалением
  if (await knex.schema.hasColumn('users', 'avatar_url')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('avatar_url');
    });
  }
  if (await knex.schema.hasColumn('users', 'photo_url')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('photo_url');
    });
  }
  if (await knex.schema.hasColumn('users', 'passport')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('passport');
    });
  }
  if (await knex.schema.hasColumn('users', 'birth_date')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('birth_date');
    });
  }
  if (await knex.schema.hasColumn('users', 'city')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('city');
    });
  }

  // 3) Удаляем is_driver и driver_license
  if (await knex.schema.hasColumn('users', 'driver_license')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('driver_license');
    });
  }
  if (await knex.schema.hasColumn('users', 'is_driver')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('is_driver');
    });
  }

  // 4) Удаляем full_name (или переименовываем обратно в name)
  const hasFullName = await knex.schema.hasColumn('users', 'full_name');
  if (hasFullName) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('full_name');
    });
  }

  // 5) Удаляем created_at и updated_at
  if (await knex.schema.hasColumn('users', 'updated_at')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('updated_at');
    });
  }
  if (await knex.schema.hasColumn('users', 'created_at')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('created_at');
    });
  }
};
