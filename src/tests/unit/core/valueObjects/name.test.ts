import { Name } from '../../../../core/valueObjects/name'
import { ValidationError } from '../../../../core/common/error'

describe('The Name Value Object', () => {
  it('creates a valid name and preserves string', () => {
    const name = Name.create('Acme Corp-1')
    expect(name.toString()).toBe('Acme Corp-1')
  })

  it('throws ValidationError for empty or too long name', () => {
    expect(() => Name.create('')).toThrow(ValidationError)
    const long = 'a'.repeat(31)
    expect(() => Name.create(long)).toThrow(ValidationError)
  })

  it('throws ValidationError for invalid characters', () => {
    expect(() => Name.create('Bad@Name')).toThrow(ValidationError)
    expect(() => Name.create('Name!')).toThrow(ValidationError)
  })

  it('isEqual compares underlying values', () => {
    const a = Name.create('Acme')
    const b = Name.create('Acme')
    const c = Name.create('Other')
    expect(a.isEqual(b)).toBe(true)
    expect(a.isEqual(c)).toBe(false)
  })
})
