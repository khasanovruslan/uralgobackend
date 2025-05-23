exports.up = async (knex) => {
    await knex.schema.alterTable('users', (table) => {
      table.boolean('isDriver').notNullable().defaultTo(false);
      table.string('driverLicense', 255).nullable();
    });
  };
  
  exports.down = async (knex) => {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('isDriver');
      table.dropColumn('driverLicense');
    });
  };
  
