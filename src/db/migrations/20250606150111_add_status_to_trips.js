// File: migrations/<timestamp>_add_status_to_trips.js

/**
 * Добавляем колонку status
 * Возможные значения: planned, in_progress, finished, canceled
 * По умолчанию: 'planned'
 */

exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable('trips');
  if (hasTable) {
    const hasColumn = await knex.schema.hasColumn('trips', 'status');
    if (!hasColumn) {
      await knex.schema.alterTable('trips', (table) => {
        table
          .enu('status', ['planned', 'in_progress', 'finished', 'canceled'], {
            useNative: true,
            enumName: 'trip_status_enum',
          })
          .notNullable()
          .defaultTo('planned');
      });
    }
  }
};

exports.down = async function (knex) {
  const hasTable = await knex.schema.hasTable('trips');
  if (hasTable) {
    const hasColumn = await knex.schema.hasColumn('trips', 'status');
    if (hasColumn) {
      await knex.schema.alterTable('trips', (table) => {
        table.dropColumn('status');
      });
      // Удаляем enum-тип
      await knex.schema.raw('DROP TYPE IF EXISTS "trip_status_enum"');
    }
  }
};
