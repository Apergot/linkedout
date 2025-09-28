import { type CompanyRepository } from '../core/repositories/companyRepository'
import { PostgresCompanyRepository } from './queries/pgCompanyRepository'
import { CompanyService } from '../application/services/companyService'
import { JobPostService } from '../application/services/jobPostService'
import { type JobPostRepository } from '../core/repositories/jobPostRepository'
import { PostgresJobPostRepository } from './queries/pgJobPostRepository'
import { readFileSync } from 'node:fs'
import { ApolloServer } from '@apollo/server'
import resolvers from './services/graphql/resolvers'
import type { MyContext } from '../index'

export class Factory {
  private static companyRepository: CompanyRepository
  private static jobPostRepository: JobPostRepository
  private static apolloServer: ApolloServer<MyContext> | null
  private static companyService: CompanyService | null
  private static jobPostService: JobPostService | null

  private static getCompanyRepository() {
    if (this.companyRepository == null) {
      this.companyRepository = new PostgresCompanyRepository()
    }

    return this.companyRepository
  }

  private static getJobPostRepository() {
    if (this.jobPostRepository == null) {
      this.jobPostRepository = new PostgresJobPostRepository()
    }
    return this.jobPostRepository
  }

  static getCompanyService(): CompanyService {
    if (this.companyService == null) {
      this.companyService = new CompanyService(this.getCompanyRepository())
    }
    return this.companyService
  }

  static getJobPostService(): JobPostService {
    if (this.jobPostService == null) {
      this.jobPostService = new JobPostService(this.getJobPostRepository())
    }
    return this.jobPostService
  }

  static getApolloServer(): ApolloServer<MyContext> {
    if (this.apolloServer == null) {
      const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' })
      this.apolloServer = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
      })
    }

    return this.apolloServer
  }
}
