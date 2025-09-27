// Use our automatically generated Book and AddBookMutationResponse types
// for type safety in our data source class
import {AddBookMutationResponse, Book, DeleteBookMutationResponse} from "./__generated__/resolvers-types";

const BooksDB: Omit<Required<Book>, "__typename">[] = [
    {
        title: "The Awakening",
        author: "Kate Chopin",
    },
    {
        title: "City of Glass",
        author: "Paul Auster",
    },
];

export class BooksDataSource {
    getBooks(): Book[] {
        // simulate fetching a list of books
        return BooksDB;
    }

    // We are using a static data set for this small example, but normally
    // this Mutation would *mutate* our underlying data using a database
    // or a REST API.
    async addBook(book: Book): Promise<AddBookMutationResponse> {
        if (book.title && book.author) {
            BooksDB.push({ title: book.title, author: book.author });

            return {
                code: "200",
                success: true,
                message: "New book added!",
                book,
            };
        } else {
            return {
                code: "400",
                success: false,
                message: "Invalid input",
                book: null,
            };
        }
    }

    async deleteBook(book: Book): Promise<DeleteBookMutationResponse> {
        const index = BooksDB.findIndex(
            (b) => b.title === book.title && b.author === book.author
        );

        if (index === -1) {
            return {
                code: "404",
                success: false,
                message: "Book not found"
            };
        }

        BooksDB.splice(index, 1);

        return {
            code: "204",
            success: true,
            message: "Book successfully deleted",
        };
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
