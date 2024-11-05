import type { FormLabelProps } from './Label'
import type { FormLang } from './lang'

export type FormError = {
  message: string
}

export type FormRule<Options = any> = (value: any, options?: Options, lang?: FormLang) => Promise<FormError | undefined>

type InferRuleOption<T> = T extends (value: any, options: infer O, lang?: FormLang) => Promise<FormError | undefined>
  ? O
  : never

export type FormRules = Record<string, FormRule>

export type InferFormRulesOptions<T> = {
  [K in keyof T]: InferRuleOption<T[K]>
}

export const FormDefaultRules: FormRules = {
  required: async (value, _, lang) => {
    if (value === null || value === undefined || value === '' || Number.isNaN(value)) {
      return { message: lang?.required }
    }
  },
  type: async (value, options: 'string' | 'number', lang) => {
    switch (options) {
      case 'string':
        if (typeof value !== 'string') {
          return { message: lang?.string }
        }
        break
      case 'number':
        if (Number.isNaN(Number(value))) {
          return { message: lang?.number }
        }
        break
    }
  },
  custom: async (value, options: (value: any) => Promise<FormError | undefined>) => {
    return options(value)
  },
} as const

export type FormDefaultRulesOptions = InferFormRulesOptions<typeof FormDefaultRules>

export async function validValues(
  rules: FormRules,
  items: FormLabelProps[],
  values: Record<string, any>,
  lang: FormLang
): Promise<Record<string, FormError>> {
  const errors: Record<string, FormError> = {}

  for (const item of items) {
    const value = values[item.name]
    const rulesOptions = item.rules

    if (rulesOptions) {
      for (const [name, options] of Object.entries(rulesOptions)) {
        const handler = rules[name]

        if (!handler) {
          console.warn(`Rule "${name}" is not defined`)

          continue
        }

        const error = await handler(value, options, lang)

        if (error) {
          errors[item.name] = error
          break
        }
      }
    }
  }

  return errors
}
