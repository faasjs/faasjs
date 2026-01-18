import { describe, expect, it, vi } from 'vitest'
import { FormDefaultLang } from '../lang'
import { FormDefaultRules, validValues } from '../rules'

describe('validValues', () => {
  describe('required', () => {
    it.each([
      ['string'],
      [0],
    ])('should return undefined if the field is not required and the value is %s', async value => {
      const result = await validValues(
        FormDefaultRules,
        [{ name: 'test', rules: { required: true } }],
        { test: value },
        FormDefaultLang
      )

      expect(result).toEqual({})
    })

    it.each([
      [undefined],
      [null],
      [''],
      [Number.NaN],
    ])('should return an error if the field is required and the value is %s', async value => {
      const result = await validValues(
        FormDefaultRules,
        [{ name: 'test', rules: { required: true } }],
        { test: value },
        FormDefaultLang
      )

      expect(result).toEqual({ test: Error('This field is required') })
    })
  })

  describe('type is string', () => {
    it('should return undefined if the field type is string and the value is a string', async () => {
      const result = await validValues(
        FormDefaultRules,
        [{ name: 'test', rules: { type: 'string' } }],
        { test: '' },
        FormDefaultLang
      )

      expect(result).toEqual({})
    })

    it.each([
      [0],
      [123],
      [Number.NaN],
    ])('should return an error if the field type is string and the value is %s', async value => {
      const result = await validValues(
        FormDefaultRules,
        [{ name: 'test', rules: { type: 'string' } }],
        { test: value },
        FormDefaultLang
      )

      expect(result).toEqual({
        test: Error('This field must be a string'),
      })
    })
  })

  describe('type is number', () => {
    it('should return undefined if the field type is number and the value is a number', async () => {
      const result = await validValues(
        FormDefaultRules,
        [{ name: 'test', rules: { type: 'number' } }],
        { test: 1 },
        FormDefaultLang
      )

      expect(result).toEqual({})
    })

    it.each([
      ['not a number'],
      [Number.NaN],
    ])('should return an error if the field type is number and the value is %s', async value => {
      const result = await validValues(
        FormDefaultRules,
        [{ name: 'test', rules: { type: 'number' } }],
        { test: value },
        FormDefaultLang
      )

      expect(result).toEqual({
        test: Error('This field must be a number'),
      })
    })
  })

  it('should return the result of the custom validation function', async () => {
    const customValidation = vi.fn().mockRejectedValue(Error('Custom error'))
    const value = 'any value'
    const result = await validValues(
      FormDefaultRules,
      [{ name: 'test', rules: { custom: customValidation } }],
      { test: value },
      FormDefaultLang
    )

    expect(result).toEqual({ test: Error('Custom error') })
    expect(customValidation).toHaveBeenCalledWith(value)
  })

  it('should return undefined if there are no validation errors', async () => {
    const result = await validValues(
      FormDefaultRules,
      [{ name: 'test', rules: {} }],
      { test: '' },
      FormDefaultLang
    )

    expect(result).toEqual({})
  })
})
