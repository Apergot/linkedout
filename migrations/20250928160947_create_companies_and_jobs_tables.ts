import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('companies', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable().unique()
    table.timestamps(true, true)
  })

  await knex.schema.createTable('job_posts', (table) => {
    table.uuid('id').primary()
    table
      .uuid('company_id')
      .unsigned()
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE')
      .notNullable()
    table.string('title').notNullable()
    table.string('location').notNullable()
    table.text('description').notNullable()
    table.enu('contract_type', ['FULL_TIME', 'PART_TIME', 'CONTRACT'])
    table.string('min_salary_money').nullable()
    table.string('max_salary_money').nullable()
    table.specificType('benefits', 'text[]').nullable()
    table.specificType('extras', 'text[]').nullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('companies')
  await knex.schema.dropTable('jobs')
}
