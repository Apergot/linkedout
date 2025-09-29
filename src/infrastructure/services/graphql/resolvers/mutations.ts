import auth from './mutations/auth'
import admin from './mutations/admin'
import jobPost from './mutations/jobPost'

const mutations = {
  ...auth,
  ...admin,
  ...jobPost,
}

export default mutations
