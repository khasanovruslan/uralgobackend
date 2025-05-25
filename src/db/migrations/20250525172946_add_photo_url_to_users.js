// migrations/XXXX_add_photo_url_to_users.js
exports.up = async function(knex) {
    await knex.schema.alterTable('users', table => {
      table.string('photo_url', 512).nullable();
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.alterTable('users', table => {
      table.dropColumn('photo_url');
    });
  };
  