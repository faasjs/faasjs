import { createSplittingContext } from '../splittingContext'
import type { FormLabelProps } from './Label'
import type { FormElementTypes } from './elements'

export type FormContextProps<Values extends Record<string, any> = Record<string, any>> = {
  // props
  items: FormLabelProps[]
  onSubmit: (values: Values) => Promise<void>
  elements: FormElementTypes

  // states
  submitting: boolean
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>
  values: Values
  setValues: React.Dispatch<React.SetStateAction<Values>>
}

const FormContext = createSplittingContext<FormContextProps>(['items', 'onSubmit', 'elements', 'submitting', 'setSubmitting', 'values', 'setValues'])

export const FormContextProvider = FormContext.Provider
export const useFormContext = FormContext.use
