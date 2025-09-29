import config from '../../../config'

export interface MyContext {
  authUser?: {
    id: string
    email: string
  } | null
  apiTokenAuth?: boolean
}

export async function contextBuilder({
  req,
}: {
  req: any
}): Promise<MyContext> {
  let authUser: { id: string; email: string } | null = null
  let apiTokenAuth = false

  // JWT Bearer auth
  try {
    const auth = (req.headers.authorization || req.headers.Authorization) as
      | string
      | undefined
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
      const token = auth.slice('Bearer '.length).trim()
      const jwt = await import('jsonwebtoken')
      const decoded = jwt.verify(token, config.jwtSecret()) as any
      if (decoded && typeof decoded === 'object') {
        const userId = decoded.userId as string | undefined
        const email = decoded.email as string | undefined
        if (userId && email) authUser = { id: userId, email }
      }
    }
  } catch (_) {
    authUser = null
  }

  // API token auth
  try {
    const apiKey = (req.headers['x-api-key'] || req.headers['X-API-KEY']) as
      | string
      | undefined
    if (apiKey && apiKey === config.apiToken()) {
      apiTokenAuth = true
    }
  } catch (_) {
    apiTokenAuth = false
  }

  return {
    authUser,
    apiTokenAuth,
  }
}
