// Query resolvers
import { Factory } from '../../../factory'

const queries = {
  // Our third argument (`contextValue`) has a type here, so we
  // can check the properties within our resolver's shared context value.
  books: async (_, __, { dataSources }) => {
    return dataSources.booksAPI.getBooks()
  },
  jobPost: async (_, { id }) => {
    try {
      const service = Factory.getJobPostService()
      const action = await service.getById()
      const result = await action({ id })
      return {
        code: '200',
        success: true,
        message: 'Job post fetched',
        jobPost: {
          id: result.id,
          companyId: result.companyId,
          title: result.title,
          location: result.location,
          description: result.description,
          contractType: result.contractType,
          minSalaryMoney: result.minSalaryMoney ?? null,
          maxSalaryMoney: result.maxSalaryMoney ?? null,
          benefitsCsv: result.benefitsCsv ?? null,
          extrasCsv: result.extrasCsv ?? null,
        },
      }
    } catch (err: any) {
      const name = err?.name
      const message = err?.message ?? 'Unexpected error while fetching job post'
      const code =
        name === 'ValidationError'
          ? '400'
          : name === 'NotFoundError'
            ? '404'
            : '500'
      return {
        code,
        success: false,
        message,
        jobPost: null,
      }
    }
  },
}

export default queries
