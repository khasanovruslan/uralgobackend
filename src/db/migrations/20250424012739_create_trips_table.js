// 20250424080300_create_trips_table.js
exports.up = async (knex) => {
  await knex.schema.createTable('trips', (table) => {
    table.increments('id').primary();
    table.integer('creator_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('origin', 255).notNullable();
    table.string('destination', 255).notNullable();
    table.timestamp('departure_time').notNullable();
    table.integer('seats').notNullable();
    table.integer('available_seats').notNullable().defaultTo(1);   
    table.integer('initial_passengers').notNullable().defaultTo(1); 
    table.boolean('allow_booking').notNullable().defaultTo(true);   
    table.decimal('price');
    table.text('description');
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('trips');
};
