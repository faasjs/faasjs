import type { FormItemProps } from './Item'
import type { FormLang } from './lang'

/**
 * A type representing a form validation rule.
 *
 * @template Options - The type of the options that can be passed to the rule.
 *
 * @param value - The value to be validated.
 * @param options - Optional. Additional options that can be used in the validation.
 * @param lang - Optional. The language settings that can be used in the validation.
 *
 * @returns A promise that resolves if the validation is successful, or rejects with an error if the validation fails.
 *
 * @example
 * ```ts
 * async function required(value: any, options: boolean, lang?: FormLang) {
 *   if (value === null || value === undefined || value === '' || Number.isNaN(value))
 *     throw Error(lang?.required)
 * }
 * ```
 */
export type FormRule<Options = any> = (
  value: any,
  options?: Options,
  lang?: FormLang
) => Promise<void>

export type InferRuleOption<T> = T extends (
  value: any,
  options: infer O,
  lang?: FormLang
) => Promise<void>
  ? O
  : never

/**
 * A type representing a set of form validation rules.
 *
 * @typedef {Record<string, FormRule>} FormRules
 *
 * Each key in the record represents the name of a form field, and the corresponding value is a `FormRule` object that defines the validation rules for that field.
 */
export type FormRules = Record<string, FormRule>

export type InferFormRulesOptions<T> = {
  [K in keyof T]: InferRuleOption<T[K]>
}

/**
 * Default validation rules for a form.
 */
export const FormDefaultRules: FormRules = {
  required: async (value, _, lang) => {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      Number.isNaN(value)
    ) {
      throw Error(lang?.required)
    }
  },
  type: async (value, options: 'string' | 'number', lang) => {
    switch (options) {
      case 'string':
        if (typeof value !== 'string') throw Error(lang?.string)

        break
      case 'number':
        if (Number.isNaN(Number(value))) throw Error(lang?.number)

        break
    }
  },
  custom: async (value, options: (value: any) => Promise<void>) => {
    return options(value)
  },
} as const

export type FormDefaultRulesOptions = InferFormRulesOptions<
  typeof FormDefaultRules
>

export async function validValues(
  rules: FormRules,
  items: FormItemProps[],
  values: Record<string, any>,
  lang: FormLang
): Promise<Record<string, Error>> {
  const errors: Record<string, Error> = {}

  for (const item of items) {
    const value = values[item.name]
    const rulesOptions = item.rules

    if (rulesOptions) {
      for (const [name, options] of Object.entries(rulesOptions)) {
        try {
          await rules[name](value, options, lang)
        } catch (error: any) {
          errors[item.name] = error
          break
        }
      }
    }
  }

  return errors
}
