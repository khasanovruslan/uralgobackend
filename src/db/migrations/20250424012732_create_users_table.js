exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary(); // ✅ автоинкрементный ID
    table.string('name');
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('phone');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
