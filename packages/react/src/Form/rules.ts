import type { FormItemProps } from './Item'
import type { FormLang } from './lang'

export type FormRule<Options = any> = (
  value: any,
  options?: Options,
  lang?: FormLang
) => Promise<void>

type InferRuleOption<T> = T extends (
  value: any,
  options: infer O,
  lang?: FormLang
) => Promise<void>
  ? O
  : never

export type FormRules = Record<string, FormRule>

export type InferFormRulesOptions<T> = {
  [K in keyof T]: InferRuleOption<T[K]>
}

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
        if (typeof value !== 'string')
          throw Error(lang?.string)

        break
      case 'number':
        if (Number.isNaN(Number(value)))
          throw Error(lang?.number)

        break
    }
  },
  custom: async (
    value,
    options: (value: any) => Promise<void>
  ) => {
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
