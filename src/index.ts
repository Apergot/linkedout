import { startStandaloneServer } from '@apollo/server/standalone'
import config from './config'
import { contextBuilder } from './infrastructure/services/graphql/contextBuilder'
import { Factory } from './infrastructure/factory'

async function bootstrap() {
  try {
    const server = Factory.getApolloServer()
    await startStandaloneServer(server, {
      listen: { port: config.port(), host: '0.0.0.0' },
      context: contextBuilder,
    })
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
