import type { Dispatch, SetStateAction } from 'react'
import { createSplittingContext } from '../splittingContext'
import type { FormElementTypes } from './elements'
import type { FormLabelElementProps } from './elements/Label'
import type { FormError } from './rules'

export type FormContextProps<
  Values extends Record<string, any> = Record<string, any>,
> = {
  // props
  items: FormLabelElementProps[]
  onSubmit: (values: Values) => Promise<void>
  Elements: FormElementTypes

  // states
  submitting: boolean
  setSubmitting: Dispatch<SetStateAction<boolean>>
  values: Values
  setValues: Dispatch<SetStateAction<Values>>
  errors: Record<string, FormError>
  setErrors: Dispatch<SetStateAction<Record<string, FormError>>>
}

const FormContext = createSplittingContext<FormContextProps>([
  'items',
  'onSubmit',
  'Elements',
  'submitting',
  'setSubmitting',
  'values',
  'setValues',
  'errors',
  'setErrors',
])

export const FormContextProvider = FormContext.Provider
export const useFormContext = FormContext.use
