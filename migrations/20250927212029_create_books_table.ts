import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("books", (table) => {
        table.increments("id").primary();
        table.string("title", 255).notNullable();
        table.string("author", 255).notNullable();
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("books");
}

