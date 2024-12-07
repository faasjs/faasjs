import type { Dispatch, SetStateAction } from 'react'
import { createSplittingContext } from '../splittingContext'
import type { FormItemProps } from './Item'
import type { FormElementTypes } from './elements'
import type { FormLang } from './lang'
import type {
  FormDefaultRules,
  FormRules,
  InferFormRulesOptions,
} from './rules'

export type FormContextProps<
  Values extends Record<string, any> = Record<string, any>,
  FormElements extends FormElementTypes = FormElementTypes,
  Rules extends FormRules = typeof FormDefaultRules,
> = {
  // props
  items: FormItemProps<FormElements, InferFormRulesOptions<Rules>>[]
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
