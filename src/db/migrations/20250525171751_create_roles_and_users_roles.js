// migrations/XXXX_create_roles_and_users_roles.js

exports.up = async function(knex) {
    await knex.schema
      .createTable('roles', table => {
        table.increments('id').primary();
        table.string('name', 50).notNullable().unique();
      })
      .createTable('users_roles', table => {
        table.integer('user_id').unsigned().notNullable()
             .references('id').inTable('users').onDelete('CASCADE');
        table.integer('role_id').unsigned().notNullable()
             .references('id').inTable('roles').onDelete('CASCADE');
        table.primary(['user_id','role_id']);
      });
  };
  
  exports.down = async function(knex) {
    await knex.schema
      .dropTableIfExists('users_roles')
      .dropTableIfExists('roles');
  };
  