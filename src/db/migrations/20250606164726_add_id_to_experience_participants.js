exports.up = async function(knex) {
  // 1) Сбрасываем существующий составной первичный ключ
  await knex.raw(`
    ALTER TABLE experience_participants
    DROP CONSTRAINT IF EXISTS exp_part_pk;
  `);

  // 2) Добавляем новую колонку id как increments (serial + PRIMARY KEY)
  await knex.schema.alterTable('experience_participants', table => {
    table.increments('id').notNullable();
  });
};


exports.down = async function(knex) {
  // 1) Удаляем колонку id
  await knex.schema.alterTable('experience_participants', table => {
    table.dropColumn('id');
  });

  // 2) Восстанавливаем составной первичный ключ на двух полях
  await knex.schema.alterTable('experience_participants', table => {
    table.primary(['participant_id', 'experience_id']);
  });
};
