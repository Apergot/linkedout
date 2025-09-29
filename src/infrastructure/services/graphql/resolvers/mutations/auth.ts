import { Factory } from '../../../../factory'

const authMutations = {
  signup: async (_: any, { email, password }: any) => {
    try {
      const service = Factory.getUserService()
      const action = await service.signup()
      const result = await action({ email, password })
      return {
        code: '200',
        success: true,
        message: 'Signup successful',
        token: result.token,
        user: { id: result.id, email: result.email, companyId: null },
      }
    } catch (err: any) {
      const isValidation = err?.name === 'ValidationError'
      return {
        code: isValidation ? '400' : '500',
        success: false,
        message: err?.message ?? 'Unexpected error while signing up',
        token: null,
        user: null,
      }
    }
  },
  login: async (_: any, { email, password }: any) => {
    try {
      const service = Factory.getUserService()
      const action = await service.login()
      const result = await action({ email, password })
      return {
        code: '200',
        success: true,
        message: 'Login successful',
        token: result.token,
        user: { id: result.id, email: result.email, companyId: null },
      }
    } catch (err: any) {
      const isUnauthorized = err?.name === 'UnauthorizedError'
      return {
        code: isUnauthorized ? '401' : '500',
        success: false,
        message: err?.message ?? 'Unexpected error while logging in',
        token: null,
        user: null,
      }
    }
  },
}

export default authMutations
