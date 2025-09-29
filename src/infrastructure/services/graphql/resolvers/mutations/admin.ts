import { Factory } from '../../../../factory'

const adminMutations = {
  setUserCompany: async (_: any, { userId, companyId }: any, ctx: any) => {
    try {
      if (!ctx?.apiTokenAuth) {
        return {
          code: '401',
          success: false,
          message: 'Unauthorized: superadmin API token required',
          user: null,
        }
      }
      const service = Factory.getUserService()
      const action = await service.setUserCompany()
      const result = await action({ userId, companyId })
      return {
        code: '200',
        success: true,
        message: 'Company assigned to user',
        user: {
          id: result.id,
          email: result.email,
          companyId: result.companyId,
        },
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
        message: err?.message ?? 'Unexpected error',
        user: null,
      }
    }
  },
  createCompany: async (_: any, { name }: any, ctx: any) => {
    try {
      if (!ctx?.apiTokenAuth) {
        return {
          code: '401',
          success: false,
          message: 'Unauthorized: superadmin API token required',
          company: null,
        }
      }
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

export default adminMutations
