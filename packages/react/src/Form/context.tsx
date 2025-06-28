import type { Dispatch, RefObject, SetStateAction } from 'react'
import { createSplittingContext } from '../splittingContext'
import type { FormElementTypes } from './elements'
import type { FormItemProps } from './Item'
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

  // refs
  valuesRef: RefObject<Values>
}

const FormContext = createSplittingContext<FormContextProps>([
  'items',
  'onSubmit',
  'Elements',
  'lang',
  'rules',

  'submitting',
  'setSubmitting',
  'values',
  'setValues',
  'errors',
  'setErrors',

  'valuesRef',
])

export const FormContextProvider = FormContext.Provider
export const useFormContext = FormContext.use
