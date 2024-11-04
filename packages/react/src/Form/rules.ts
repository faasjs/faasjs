import type { FormLabelProps } from './Label'
import type { FormLang } from './lang'

export type FormRules = {
  type?: 'string' | 'number'
  required?: boolean
  custom?: (value: any) => Promise<FormError | undefined>
}

export type FormError = {
  message: string
}

export async function validValue(
  rules: FormRules,
  value: any,
  lang: FormLang
): Promise<FormError | undefined> {
  if (
    rules.required &&
    (value === null ||
      value === undefined ||
      value === '' ||
      Number.isNaN(value))
  )
    return { message: lang.required }

  if (rules.type === 'number' && Number.isNaN(Number(value)))
    return { message: lang.number }

  return rules.custom?.(value)
}

export async function validValues(
  items: FormLabelProps[],
  values: Record<string, any>,
  lang: FormLang
): Promise<Record<string, FormError>> {
  const errors: Record<string, FormError> = {}

  for (const item of items) {
    const value = values[item.name]
    const rules = item.rules

    if (rules) {
      const error = await validValue(rules, value, lang)
      if (error) errors[item.name] = error
    }
  }

  return errors
}
