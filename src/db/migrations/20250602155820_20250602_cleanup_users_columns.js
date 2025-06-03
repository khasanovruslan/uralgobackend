// src/db/migrations/20250602_cleanup_users_columns.js

exports.up = async function(knex) {
    await knex.schema.alterTable('users', table => {
      // Удаляем колонки в camelCase, если они существуют
      table.dropColumn('isDriver');
      table.dropColumn('driverLicense');
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.alterTable('users', table => {
      // При откате восстанавливаем эти колонки (хотя скорее всего
      // вам их больше не потребуется, но Knex требует описать down)
      table.boolean('isDriver').notNullable().defaultTo(false);
      table.string('driverLicense', 255).nullable();
    });
  };
  