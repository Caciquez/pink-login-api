
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(t) {
    t.increments('id').primary();
 
    t.string('name').notNullable();
    t.string('email').notNullable();
    t.string('password').notNullable();
    t.boolean('active').notNullable();
    t.string('genre').notNullable();
    t.string('devive_token').notNullable();
    t.string('cellphone').notNullable();
    t.timestamp('birth_date', { useTz: false }).notNullable();

    t.timestamp("created_at", { useTz: false });
    t.timestamp("updated_at", { useTz: false });
    t.timestamp("deleted_at", { useTz: false });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users")
};
