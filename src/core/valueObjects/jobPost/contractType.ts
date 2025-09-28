import { ValidationError } from '../../common/error'

export type ContractTypeLiteral = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT'

export class ContractType {
  private readonly value: ContractTypeLiteral

  private constructor(value: ContractTypeLiteral) {
    this.value = value
  }

  static create(value: string): ContractType {
    const upper = (value ?? '').toUpperCase().trim()
    if (!['FULL_TIME', 'PART_TIME', 'CONTRACT'].includes(upper)) {
      throw new ValidationError(
        'Invalid contract type. Allowed values: FULL_TIME, PART_TIME, CONTRACT'
      )
    }
    return new ContractType(upper as ContractTypeLiteral)
  }

  toString(): ContractTypeLiteral {
    return this.value
  }

  isEqual(other: ContractType): boolean {
    return this.value === other.value
  }
}
