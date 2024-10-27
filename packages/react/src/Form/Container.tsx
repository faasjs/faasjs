import { FormBody } from './Body'
import { FormContextProvider, type FormContextProps } from './context'
import { FormElements, type FormElementTypes } from './elements'
import { FormFooter } from './Footer'
import type { FormLabelProps } from './Label'
import { useSplittingState } from '../splittingState'

export type FormProps<
  Values extends Record<string, any> = Record<string, any>,
  FormElements extends FormElementTypes = FormElementTypes,
> = {
  items: FormLabelProps<FormElements>[]
  onSubmit?: (values: Values) => Promise<void>
  elements?: FormElements
  defaultValues?: Values
}

function mergeValues<Values extends Record<string, any>>(
  items: FormLabelProps[],
  defaultValues: Values = {} as Values
) {
  const values = {} as Values

  for (const item of items)
    values[item.name as keyof Values] = defaultValues[item.name] ?? ''

  return values
}

export function FormContainer<
  Values extends Record<string, any> = Record<string, any>,
  FormElements extends FormElementTypes = FormElementTypes,
>({ defaultValues, elements, ...props }: FormProps<Values, FormElements>) {
  const states = useSplittingState({
    values: mergeValues(props.items, defaultValues),
    submitting: false,
    elements: Object.assign(FormElements, elements) as FormElementTypes,
  })

  return (
    <FormContextProvider
      value={
        {
          ...states,
          ...props,
        } as FormContextProps
      }
    >
      <FormBody />
      <FormFooter />
    </FormContextProvider>
  )
}
