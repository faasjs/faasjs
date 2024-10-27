import { createSplittingContext } from '../splittingContext'
import type { FormLabelElementProps } from './elements/Label'
import type { FormElementTypes } from './elements'

export type FormContextProps<Values extends Record<string, any> = Record<string, any>> = {
  // props
  items: FormLabelElementProps[]
  onSubmit: (values: Values) => Promise<void>
  Elements: FormElementTypes

  // states
  submitting: boolean
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>
  values: Values
  setValues: React.Dispatch<React.SetStateAction<Values>>
}

const FormContext = createSplittingContext<FormContextProps>(['items', 'onSubmit', 'Elements', 'submitting', 'setSubmitting', 'values', 'setValues'])

export const FormContextProvider = FormContext.Provider
export const useFormContext = FormContext.use
