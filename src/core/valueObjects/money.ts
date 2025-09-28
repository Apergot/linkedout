import { ValidationError } from '../common/error'

export class Money {
  private readonly amount: number
  private readonly currency: string
  private readonly value: string

  private constructor(amount: number, currency: string) {
    this.amount = amount
    this.currency = currency
    this.value = `${amount} ${currency}`
  }

  static create(amount: number, currency: string): Money {
    if (!this.isValidAmount(amount)) {
      throw new ValidationError('Amount must be a number greater than 0.')
    }
    if (!this.isValidCurrency(currency)) {
      throw new ValidationError('Currency must be a valid 3-letter ISO code.')
    }
    return new Money(amount, currency.toUpperCase())
  }

  static createFromString(value: string): Money {
    const match = value.match(/^(\d+(\.\d+)?)\s+([A-Z]{3})$/)
    if (!match) {
      throw new ValidationError(
        'Invalid persisted Money format. Expected format: "100 USD"'
      )
    }

    const amount = parseFloat(match[1])
    const currency = match[3]
    return new Money(amount, currency)
  }

  private static isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && !isNaN(amount) && amount > 0
  }

  private static isValidCurrency(currency: string): boolean {
    return typeof currency === 'string' && /^[A-Z]{3}$/i.test(currency)
  }

  toString(): string {
    return this.value
  }

  getAmount(): number {
    return this.amount
  }

  getCurrency(): string {
    return this.currency
  }

  isEqual(other: Money): boolean {
    return this.value === other.value
  }
}
