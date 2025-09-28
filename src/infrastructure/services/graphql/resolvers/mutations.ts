// Use the generated `MutationResolvers` type to type check our mutations!
import { type MutationResolvers } from '../__generated__/resolvers-types'
import { Factory } from '../../../factory'

const mutations: MutationResolvers = {
  // Below, we mock adding a new book. Our data set is static for this
  // example, so we won't actually modify our data.
  addBook: async (_, { title, author }, { dataSources }) => {
    return await dataSources.booksAPI.addBook({ title, author })
  },
  createCompany: async (_, { name }) => {
    try {
      const service = Factory.getCompanyService()
      const action = await service.create()
      const result = await action({ name: name ?? '' })

      return {
        code: '200',
        success: true,
        message: 'Company created',
        company: { name: result.name },
      }
    } catch (err: any) {
      console.log(err)
      const message = err?.message ?? 'Unexpected error while creating company'
      const isValidation = err?.name === 'ValidationError'
      return {
        code: isValidation ? '400' : '500',
        success: false,
        message,
        company: null,
      }
    }
  },
}

export default mutations
