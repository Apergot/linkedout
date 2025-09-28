import { type UserRepository } from '../../core/repositories/userRepository'
import { SignupUserAction } from '../actions/user/signupUser'
import { LoginUserAction } from '../actions/user/loginUser'
import { SetMyCompanyAction } from '../actions/user/setMyCompany'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup() {
    return SignupUserAction(this.userRepository)
  }

  async login() {
    return LoginUserAction(this.userRepository)
  }

  async setMyCompany() {
    return SetMyCompanyAction(this.userRepository)
  }
}
