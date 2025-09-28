// Use our automatically generated Book and AddBookMutationResponse types
// for type safety in our data source class

import { withPgClient } from '../../queries/pgQueryExecutor'
import { type QueryConfig } from 'pg'
import {
  type AddBookMutationResponse,
  type Book,
} from './__generated__/resolvers-types'

export class BooksDataSource {
  async getBooks(): Promise<Book[]> {
    return await withPgClient(async (pgClient) => {
      const queryConfig: QueryConfig = {
        text: 'SELECT * FROM books',
        values: [],
      }

      const { rows } = await pgClient.query(queryConfig)

      return rows.length > 0
        ? rows.map(
            (row) => ({ title: row.title, author: row.author }) satisfies Book
          )
        : []
    })
  }

  // We are using a static data set for this small example, but normally
  // this Mutation would *mutate* our underlying data using a database
  // or a REST API.
  async addBook(book: Book): Promise<AddBookMutationResponse> {
    if (book.title && book.author) {
      const newBook = await withPgClient(async (pgClient) => {
        const queryConfig: QueryConfig = {
          text: 'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
          values: [book.title, book.author],
        }

        const { rows } = await pgClient.query(queryConfig)

        return rows.length > 0
          ? ({ title: rows[0].title, author: rows[0].author } satisfies Book)
          : undefined
      })

      return {
        code: '200',
        success: true,
        message: 'New book added!',
        book: newBook,
      }
    } else {
      return {
        code: '400',
        success: false,
        message: 'Invalid input',
        book: null,
      }
    }
  }
}

/*
query getBooks{
  books {
    title
  }
}

mutation {
  addBook(title: "las aventuras de paquito", author: "paquito") {
    book {
      author
      title
      __typename
    }
  }
}

mutation {
  deleteBook(title: "las aventuras de paquito", author: "paquito") {
    message
  }
}
 */
