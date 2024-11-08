import type { Dispatch, SetStateAction } from 'react'
import { createSplittingContext } from '../splittingContext'
import type { FormElementTypes } from './elements'
import type { FormLabelElementProps } from './elements/Label'
import type { FormLang } from './lang'
import type { FormDefaultRules, FormRules } from './rules'

export type FormContextProps<
  Values extends Record<string, any> = Record<string, any>,
  Rules extends FormRules = typeof FormDefaultRules,
> = {
  // props
  items: FormLabelElementProps[]
  onSubmit: (values: Values) => Promise<void>
  Elements: FormElementTypes
  lang: FormLang
  rules: typeof FormDefaultRules & Rules

  // states
  submitting: boolean
  setSubmitting: Dispatch<SetStateAction<boolean>>
  values: Values
  setValues: Dispatch<SetStateAction<Values>>
  errors: Record<string, Error>
  setErrors: Dispatch<SetStateAction<Record<string, Error>>>
}

const FormContext = createSplittingContext<FormContextProps>([
  'items',
  'onSubmit',
  'Elements',
  'lang',
  'submitting',
  'setSubmitting',
  'values',
  'setValues',
  'errors',
  'setErrors',
  'rules',
])

export const FormContextProvider = FormContext.Provider
export const useFormContext = FormContext.use
