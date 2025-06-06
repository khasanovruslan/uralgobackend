// File: src/db/migrations/XXXXXXXXXXXX_add_id_to_experience_participants.js

exports.up = async function(knex) {
  const hasTable = await knex.schema.hasTable('experience_participants');
  if (hasTable) {
    const hasIdColumn = await knex.schema.hasColumn('experience_participants', 'id');
    if (!hasIdColumn) {
      // Добавляем колонку id в начало (serial primary key)
      await knex.schema.alterTable('experience_participants', table => {
        table.increments('id').primary().first();
      });
    }
  }
};

exports.down = async function(knex) {
  const hasTable = await knex.schema.hasTable('experience_participants');
  if (hasTable) {
    const hasIdColumn = await knex.schema.hasColumn('experience_participants', 'id');
    if (hasIdColumn) {
      await knex.schema.alterTable('experience_participants', table => {
        table.dropColumn('id');
      });
    }
  }
};
