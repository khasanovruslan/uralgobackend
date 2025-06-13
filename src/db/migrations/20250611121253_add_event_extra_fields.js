// пример: src/db/migrations/20250612_add_event_extra_fields.js
exports.up = async function(knex) {
  await knex.schema.alterTable('events', table => {
    table.text('address').nullable();
    table
      .timestamp('start_time', { useTz: true })
      .nullable();
    table
      .timestamp('end_time', { useTz: true })
      .nullable();
    table.integer('max_participants').nullable();
    table
      .string('image_url', 255)
      .nullable();
    table
      .string('category', 100)
      .nullable();
    table.jsonb('tags').nullable();
    // поле для отслеживания изменений
    table
      .timestamp('updated_at', { useTz: true })
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('events', table => {
    table.dropColumn('address');
    table.dropColumn('start_time');
    table.dropColumn('end_time');
    table.dropColumn('max_participants');
    table.dropColumn('image_url');
    table.dropColumn('category');
    table.dropColumn('tags');
    table.dropColumn('updated_at');
  });
};
