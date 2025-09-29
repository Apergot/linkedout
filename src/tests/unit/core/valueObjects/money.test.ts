import { Money } from '../../../../core/valueObjects/money'
import { ValidationError } from '../../../../core/common/error'

describe('The Money Value Object', () => {
  describe('creates a Money object for a valid tuple input', () => {
    it('should create a Money object with valid amount and currency', () => {
      const money = Money.create(100, 'usd')
      expect(money.toString()).toBe('100 USD')
      expect(money.getAmount()).toBe(100)
      expect(money.getCurrency()).toBe('USD')
    })

    it('should throw ValidationError for zero amount', () => {
      expect(() => Money.create(0, 'USD')).toThrow(ValidationError)
    })

    it('should throw ValidationError for negative amount', () => {
      expect(() => Money.create(-50, 'USD')).toThrow(ValidationError)
    })

    it('should throw ValidationError for invalid currency code', () => {
      expect(() => Money.create(100, 'US')).toThrow(ValidationError)
      expect(() => Money.create(100, 'usdollars')).toThrow(ValidationError)
      expect(() => Money.create(100, '12A')).toThrow(ValidationError)
    })
  })

  describe('The Money createFromString method', () => {
    it('should reconstruct Money from a valid string', () => {
      const money = Money.createFromString('250.5 EUR')
      expect(money.getAmount()).toBe(250.5)
      expect(money.getCurrency()).toBe('EUR')
      expect(money.toString()).toBe('250.5 EUR')
    })

    it('should throw ValidationError for malformed string', () => {
      const invalidInputs = [
        '',
        '250USD',
        '250usd',
        'USD 250',
        'USD250',
        'two hundred USD',
        '100US D',
        '100   ', // trailing without currency
      ]

      invalidInputs.forEach((input) => {
        expect(() => Money.createFromString(input)).toThrow(ValidationError)
      })
    })
  })

  describe('The Money method isEqual', () => {
    it('should return true for equal Money instances', () => {
      const m1 = Money.create(100, 'usd')
      const m2 = Money.createFromString('100 USD')
      expect(m1.isEqual(m2)).toBe(true)
    })

    it('should return false for different amounts', () => {
      const m1 = Money.create(100, 'USD')
      const m2 = Money.create(200, 'USD')
      expect(m1.isEqual(m2)).toBe(false)
    })

    it('should return false for different currencies', () => {
      const m1 = Money.create(100, 'USD')
      const m2 = Money.create(100, 'EUR')
      expect(m1.isEqual(m2)).toBe(false)
    })
  })
})
