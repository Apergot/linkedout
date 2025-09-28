import { ValidationError } from '../common/error'

export class Name {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(nickname: string): Name {
    if (!this.isValidNickname(nickname)) {
      throw new ValidationError(
        'Name must be between 1 and 30 characters and contain only alphanumeric characters, underscores (_), hyphens (-), or spaces.'
      )
    }
    return new Name(nickname)
  }

  private static isValidNickname(nickname: string): boolean {
    const nicknameRegex = /^[a-zA-Z0-9 _-]{1,30}$/ // Allows alphanumeric, _, -, and spaces, up to 30 chars
    return nicknameRegex.test(nickname)
  }

  toString(): string {
    return this.value
  }

  isEqual(other: Name): boolean {
    return this.value === other.value
  }
}
