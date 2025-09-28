import { type Id } from '../valueObjects/id'
import { type Name } from '../valueObjects/name'

export class Company {
  constructor(
    private readonly id: Id,
    private readonly name: Name
  ) {}

  isMatchingName(name: Name) {
    return this.name.isEqual(name)
  }

  isEquals(company: Company) {
    return this.id.equals(company.id)
  }
}
