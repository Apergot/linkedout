import { type CompanyRepository } from '../core/repositories/companyRepository'
import { PostgresCompanyRepository } from './queries/pgCompanyRepository'
import { CompanyService } from '../application/services/companyService'
import { readFileSync } from 'node:fs'
import { ApolloServer } from '@apollo/server'
import resolvers from './services/graphql/resolvers'

export class Factory {
  private static companyRepository: CompanyRepository
  private static apolloServer: ApolloServer | null

  private static getCompanyRepository() {
    if (this.companyRepository == null) {
      this.companyRepository = new PostgresCompanyRepository()
    }

    return this.companyRepository
  }

  private static createCompanyService() {
    return new CompanyService(this.getCompanyRepository())
  }

  static getApolloServer(): ApolloServer {
    if (this.apolloServer == null) {
      const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' })
      this.apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
      })
    }

    return this.apolloServer
  }
}
