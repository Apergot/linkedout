// Use the generated `QueryResolvers` type to type check our queries!
import { type QueryResolvers } from '../__generated__/resolvers-types'

const queries: QueryResolvers = {
  // Our third argument (`contextValue`) has a type here, so we
  // can check the properties within our resolver's shared context value.
  books: async (_, __, { dataSources }) => {
    return dataSources.booksAPI.getBooks()
  },
}

export default queries
