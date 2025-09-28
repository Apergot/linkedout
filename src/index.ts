import { startStandaloneServer } from '@apollo/server/standalone'
import { BooksDataSource } from './infrastructure/services/graphql/datasources'
import config from './config'
import { Factory } from './infrastructure/factory'

export interface MyContext {
  dataSources: {
    booksAPI: BooksDataSource
  }
}

async function bootstrap() {
  try {
    const server = Factory.getApolloServer()

    // Passing an ApolloServer instance to the `startStandaloneServer` function:
    //  1. creates an Express app
    //  2. install your ApolloServer instance as middleware
    //  3. prepares your app to handle incoming requests
    const { url } = await startStandaloneServer(server, {
      listen: { port: config.port(), host: '0.0.0.0' },
      context: async () => {
        return {
          // We are using a static data set for this example, but normally
          // this would be where you'd add your data source connections
          // or your REST API classes.
          dataSources: {
            booksAPI: new BooksDataSource(),
          },
        }
      },
    })
    console.log(`🚀  Server ready at: ${url} with env ${config.environment()}`)
  } catch (error) {
    console.error('App failed to start:', error)
    process.exit(1)
  }
}

bootstrap()
  .then(() => {
    console.log('App bootstrap finished')
  })
  .catch((error) => {
    console.log(`Error while bootstrapping: ${error.message}`)
  })
