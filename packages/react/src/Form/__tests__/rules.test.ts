import type { FormLabelProps } from '../Label'
import { FormDefaultLang } from '../lang'
import { type FormRules, validValue, validValues } from '../rules'

describe('validValue', () => {
  describe('required', () => {
    it.each([['string'], [0]])(
      'should return undefined if the field is not required and the value is %s',
      async value => {
        const rules: FormRules = { required: false }
        const result = await validValue(rules, value, FormDefaultLang)

        expect(result).toBeUndefined()
      }
    )

    it.each([[undefined], [null], [''], [Number.NaN]])(
      'should return an error if the field is required and the value is %s',
      async value => {
        const rules: FormRules = { required: true }
        const result = await validValue(rules, value, FormDefaultLang)

        expect(result).toEqual({ message: 'This field is required' })
      }
    )
  })

  describe('type', () => {
    it('should return undefined if the field type is number and the value is a number', async () => {
      const rules: FormRules = { type: 'number' }
      const value = 123
      const result = await validValue(rules, value, FormDefaultLang)
      expect(result).toBeUndefined()
    })

    it.each([['not a number'], [Number.NaN]])(
      'should return an error if the field type is number and the value is %s',
      async value => {
        const rules: FormRules = { type: 'number' }
        const result = await validValue(rules, value, FormDefaultLang)

        expect(result).toEqual({ message: 'This field must be a number' })
      }
    )
  })

  it('should return the result of the custom validation function', async () => {
    const customValidation = jest
      .fn()
      .mockResolvedValue({ message: 'Custom error' })
    const rules: FormRules = { custom: customValidation }
    const value = 'any value'
    const result = await validValue(rules, value, FormDefaultLang)

    expect(result).toEqual({ message: 'Custom error' })
    expect(customValidation).toHaveBeenCalledWith(value)
  })

  it('should return undefined if there are no validation errors', async () => {
    const rules: FormRules = {}
    const value = 'any value'
    const result = await validValue(rules, value, FormDefaultLang)

    expect(result).toBeUndefined()
  })
})

describe('validValues', () => {
  it('should return an empty object if there are no validation errors', async () => {
    const items: FormLabelProps[] = [
      { name: 'field1', rules: { required: false } },
      { name: 'field2', rules: { type: 'number' } },
    ]
    const values = {
      field1: 'some value',
      field2: 123,
    }
    const result = await validValues(items, values, FormDefaultLang)

    expect(result).toEqual({})
  })

  it('should return errors for fields that fail validation', async () => {
    const items: FormLabelProps[] = [
      { name: 'field1', rules: { required: true } },
      { name: 'field2', rules: { type: 'number' } },
    ]
    const values = {
      field1: '',
      field2: 'not a number',
    }
    const result = await validValues(items, values, FormDefaultLang)

    expect(result).toEqual({
      field1: { message: 'This field is required' },
      field2: { message: 'This field must be a number' },
    })
  })

  it('should return the result of the custom validation function', async () => {
    const customValidation = jest
      .fn()
      .mockResolvedValue({ message: 'Custom error' })
    const items = [{ name: 'field1', rules: { custom: customValidation } }]
    const values = {
      field1: 'any value',
    }
    const result = await validValues(items, values, FormDefaultLang)

    expect(result).toEqual({
      field1: { message: 'Custom error' },
    })
    expect(customValidation).toHaveBeenCalledWith('any value')
  })

  it('should return errors for multiple fields that fail validation', async () => {
    const items: FormLabelProps[] = [
      { name: 'field1', rules: { required: true } },
      { name: 'field2', rules: { type: 'number' } },
      {
        name: 'field3',
        rules: {
          custom: jest.fn().mockResolvedValue({ message: 'Custom error' }),
        },
      },
    ]
    const values = {
      field1: '',
      field2: 'not a number',
      field3: 'any value',
    }
    const result = await validValues(items, values, FormDefaultLang)

    expect(result).toEqual({
      field1: { message: 'This field is required' },
      field2: { message: 'This field must be a number' },
      field3: { message: 'Custom error' },
    })
  })
})
