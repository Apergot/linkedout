import { Factory } from '../../../../factory'

const jobPostMutations = {
  createJobPost: async (_: any, { input }: any, ctx: any) => {
    try {
      if (!ctx?.authUser) {
        return {
          code: '401',
          success: false,
          message: 'Unauthorized',
          jobPost: null,
        }
      }

      const userService = Factory.getUserService()
      const getUser = await userService.getById()
      const currentUser = await getUser({ id: ctx.authUser.id })
      if (!currentUser.companyId || currentUser.companyId !== input.companyId) {
        return {
          code: '403',
          success: false,
          message:
            'Forbidden: you can only create job posts for your own company',
          jobPost: null,
        }
      }

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
  updateJobPost: async (_: any, { input }: any, ctx: any) => {
    try {
      if (!ctx?.authUser) {
        return {
          code: '401',
          success: false,
          message: 'Unauthorized',
          jobPost: null,
        }
      }

      const userService = Factory.getUserService()
      const getUser = await userService.getById()
      const currentUser = await getUser({ id: ctx.authUser.id })
      if (!currentUser.companyId || currentUser.companyId !== input.companyId) {
        return {
          code: '403',
          success: false,
          message:
            'Forbidden: you can only update job posts for your own company',
          jobPost: null,
        }
      }

      const jobService = Factory.getJobPostService()
      const getJob = await jobService.getById()
      const existing = await getJob({ id: input.id })
      if (existing.companyId !== currentUser.companyId) {
        return {
          code: '403',
          success: false,
          message: 'Forbidden: cannot update a job post from another company',
          jobPost: null,
        }
      }

      const action = await jobService.update()
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
  deleteJobPost: async (_: any, { id }: any, ctx: any) => {
    try {
      if (!ctx?.authUser) {
        return {
          code: '401',
          success: false,
          message: 'Unauthorized',
          id: id ?? null,
          deleted: false,
        }
      }

      const userService = Factory.getUserService()
      const getUser = await userService.getById()
      const currentUser = await getUser({ id: ctx.authUser.id })

      const jobService = Factory.getJobPostService()
      const getJob = await jobService.getById()
      const existing = await getJob({ id })
      if (
        !currentUser.companyId ||
        existing.companyId !== currentUser.companyId
      ) {
        return {
          code: '403',
          success: false,
          message: 'Forbidden: cannot delete a job post from another company',
          id: id ?? null,
          deleted: false,
        }
      }

      const action = await jobService.delete()
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
      const code =
        name === 'ValidationError'
          ? '400'
          : name === 'NotFoundError'
            ? '404'
            : '500'
      return {
        code,
        success: false,
        message: err?.message ?? 'Unexpected error while deleting job post',
        id: id ?? null,
        deleted: false,
      }
    }
  },
}

export default jobPostMutations
