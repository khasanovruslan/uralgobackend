// File: migrations/20250606063031_alter_users_add_fields.js

exports.up = async function (knex) {
  // ───────────────────────────────────────────
  // 1) Добавляем full_name
  // ───────────────────────────────────────────
  const hasFullName = await knex.schema.hasColumn('users', 'full_name');
  if (!hasFullName) {
    await knex.schema.alterTable('users', (table) => {
      table.string('full_name', 255).notNullable().defaultTo('');
    });
  }

  // ───────────────────────────────────────────
  // 2) Добавляем avatar_url
  // ───────────────────────────────────────────
  const hasAvatar = await knex.schema.hasColumn('users', 'avatar_url');
  if (!hasAvatar) {
    await knex.schema.alterTable('users', (table) => {
      table.string('avatar_url', 512).nullable();
    });
  }

  // ───────────────────────────────────────────
  // 3) Добавляем created_at
  // ───────────────────────────────────────────
  const hasCreatedAt = await knex.schema.hasColumn('users', 'created_at');
  if (!hasCreatedAt) {
    await knex.schema.alterTable('users', (table) => {
      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  }

  // ───────────────────────────────────────────
  // 4) Добавляем updated_at
  // ───────────────────────────────────────────
  const hasUpdatedAt = await knex.schema.hasColumn('users', 'updated_at');
  if (!hasUpdatedAt) {
    await knex.schema.alterTable('users', (table) => {
      table
        .timestamp('updated_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  }

  // ───────────────────────────────────────────
  // 5) Добавляем уникальный индекс на email
  // ───────────────────────────────────────────
  // Проверяем, существует ли индекс users_email_unique
  const indexCheck = await knex.raw(
    `SELECT to_regclass('public.users_email_unique') as index_name`
  );

  // Если to_regclass вернул null, значит индекс отсутствует
  if (!indexCheck.rows[0].index_name) {
    await knex.schema.alterTable('users', (table) => {
      table.unique('email', 'users_email_unique');
    });
  }
};

exports.down = async function (knex) {
  // ───────────────────────────────────────────
  // 1) Удаляем индекс users_email_unique
  // ───────────────────────────────────────────
  // DROP INDEX IF EXISTS users_email_unique
  await knex.schema.raw(`DROP INDEX IF EXISTS users_email_unique`);

  // ───────────────────────────────────────────
  // 2) Удаляем updated_at, created_at, avatar_url, full_name
  // ───────────────────────────────────────────
  const hasUpdatedAt = await knex.schema.hasColumn('users', 'updated_at');
  if (hasUpdatedAt) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('updated_at');
    });
  }

  const hasCreatedAt = await knex.schema.hasColumn('users', 'created_at');
  if (hasCreatedAt) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('created_at');
    });
  }

  const hasAvatar = await knex.schema.hasColumn('users', 'avatar_url');
  if (hasAvatar) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('avatar_url');
    });
  }

  const hasFullName = await knex.schema.hasColumn('users', 'full_name');
  if (hasFullName) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('full_name');
    });
  }
};
