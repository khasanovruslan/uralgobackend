// knex миграция
exports.up = function(knex) {
    return knex.schema.table('users', table => {
      table.string('city', 255);
      table.date('birth_date');
      table.string('passport', 50);
      // эти поля могли уже быть, но если нет — добавятся
      table.boolean('is_driver').notNullable().defaultTo(false);
      table.string('driver_license', 255);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('users', table => {
      table.dropColumn('city');
      table.dropColumn('birth_date');
      table.dropColumn('passport');
      table.dropColumn('is_driver');
      table.dropColumn('driver_license');
    });
  };
  