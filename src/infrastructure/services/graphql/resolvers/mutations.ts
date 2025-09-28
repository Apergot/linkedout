// Mutations resolvers
import { Factory } from '../../../factory'

const mutations = {
  // Below, we mock adding a new book. Our data set is static for this
  // example, so we won't actually modify our data.
  addBook: async (_, { title, author }, { dataSources }) => {
    return dataSources.booksAPI.addBook({ title, author })
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
  createJobPost: async (_, { input }) => {
    try {
      const service = Factory.getJobPostService()
      const action = await service.create()
      const result = await action({
        companyId: input.companyId,
        title: input.title,
        location: input.location,
        description: input.description,
        contractType: input.contractType,
        minSalaryAmount: input.minSalaryAmount ?? null,
        minSalaryCurrency: input.minSalaryCurrency ?? null,
        maxSalaryAmount: input.maxSalaryAmount ?? null,
        maxSalaryCurrency: input.maxSalaryCurrency ?? null,
        benefitsCsv: input.benefitsCsv ?? null,
        extrasCsv: input.extrasCsv ?? null,
      })
      return {
        code: '200',
        success: true,
        message: 'Job post created',
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
      const message = err?.message ?? 'Unexpected error while creating job post'
      const isValidation = err?.name === 'ValidationError'
      return {
        code: isValidation ? '400' : '500',
        success: false,
        message,
        jobPost: null,
      }
    }
  },
  updateJobPost: async (_, { input }) => {
    try {
      const service = Factory.getJobPostService()
      const action = await service.update()
      const result = await action({
        id: input.id,
        companyId: input.companyId,
        title: input.title,
        location: input.location,
        description: input.description,
        contractType: input.contractType,
        minSalaryAmount: input.minSalaryAmount ?? null,
        minSalaryCurrency: input.minSalaryCurrency ?? null,
        maxSalaryAmount: input.maxSalaryAmount ?? null,
        maxSalaryCurrency: input.maxSalaryCurrency ?? null,
        benefitsCsv: input.benefitsCsv ?? null,
        extrasCsv: input.extrasCsv ?? null,
      })
      return {
        code: '200',
        success: true,
        message: 'Job post updated',
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
      const message = err?.message ?? 'Unexpected error while updating job post'
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
  deleteJobPost: async (_, { id }) => {
    try {
      const service = Factory.getJobPostService()
      const action = await service.delete()
      const result = await action({ id })
      return {
        code: result.deleted ? '200' : '500',
        success: result.deleted,
        message: result.deleted ? 'Job post deleted' : 'Deletion failed',
        id: result.id,
        deleted: result.deleted,
      }
    } catch (err: any) {
      const name = err?.name
      const message = err?.message ?? 'Unexpected error while deleting job post'
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
        id: id ?? null,
        deleted: false,
      }
    }
  },
}

export default mutations
