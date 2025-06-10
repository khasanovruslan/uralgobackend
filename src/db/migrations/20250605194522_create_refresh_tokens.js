exports.up = function(knex) {
  return knex.schema.createTable('refresh_tokens', table => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('token').notNullable();
    table.timestamp('expires_at').notNullable();
    table.string('user_agent');
    table.string('ip_address');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
