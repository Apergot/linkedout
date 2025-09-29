import { Factory } from '../../../../factory'

const jobPostQueries = {
  jobPost: async (_: any, { id }: any) => {
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
  jobPosts: async (_: any, { filter, limit, offset }: any) => {
    try {
      const service = Factory.getJobPostService()
      const action = await service.search()
      const result = await action({
        title: filter?.title ?? null,
        location: filter?.location ?? null,
        minSalaryAmount: filter?.minSalaryAmount ?? null,
        maxSalaryAmount: filter?.maxSalaryAmount ?? null,
        limit: limit ?? null,
        offset: offset ?? null,
      })
      return {
        code: '200',
        success: true,
        message: 'Job posts fetched',
        items: result.items.map((jp) => ({
          id: jp.id,
          companyId: jp.companyId,
          title: jp.title,
          location: jp.location,
          description: jp.description,
          contractType: jp.contractType,
          minSalaryMoney: jp.minSalaryMoney ?? null,
          maxSalaryMoney: jp.maxSalaryMoney ?? null,
          benefitsCsv: jp.benefitsCsv ?? null,
          extrasCsv: jp.extrasCsv ?? null,
        })),
      }
    } catch (err: any) {
      const message =
        err?.message ?? 'Unexpected error while searching job posts'
      return {
        code: '500',
        success: false,
        message,
        items: [],
      }
    }
  },
}

export default jobPostQueries
