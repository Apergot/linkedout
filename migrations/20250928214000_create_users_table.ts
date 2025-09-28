import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('email').notNullable().unique()
    table.string('password_hash').notNullable()
    table
      .uuid('company_id')
      .unsigned()
      .references('id')
      .inTable('companies')
      .onDelete('SET NULL')
      .nullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
