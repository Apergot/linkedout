import { startStandaloneServer } from '@apollo/server/standalone'
import { BooksDataSource } from './infrastructure/services/graphql/datasources'
import config from './config'
import { Factory } from './infrastructure/factory'

export interface MyContext {
  dataSources: {
    booksAPI: BooksDataSource
  }
  authUser?: {
    id: string
    email: string
  } | null
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
      context: async ({ req }) => {
        let authUser: { id: string; email: string } | null = null
        try {
          const auth = req.headers.authorization || req.headers.Authorization
          if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
            const token = auth.slice('Bearer '.length).trim()
            const jwt = await import('jsonwebtoken')
            const decoded = jwt.verify(token, config.jwtSecret())
            if (decoded && typeof decoded === 'object') {
              const userId = (decoded as any).userId as string | undefined
              const email = (decoded as any).email as string | undefined
              if (userId && email) authUser = { id: userId, email }
            }
          }
        } catch (_) {
          authUser = null
        }
        return {
          dataSources: {
            booksAPI: new BooksDataSource(),
          },
          authUser,
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
