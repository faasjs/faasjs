import { FormBody } from './Body'
import { FormContextProvider, type FormContextProps } from './context'
import { FormDefaultElements, type FormElementTypes } from './elements'
import { FormFooter } from './Footer'
import { useSplittingState } from '../splittingState'
import type { FormLabelElementProps } from './elements/Label'

export type FormProps<
  Values extends Record<string, any> = Record<string, any>,
  FormElements extends FormElementTypes = FormElementTypes,
> = {
  items: FormLabelElementProps[]
  onSubmit?: (values: Values) => Promise<void>
  elements?: Partial<FormElements>
  defaultValues?: Values
}

function mergeValues<Values extends Record<string, any>>(
  items: FormLabelElementProps[],
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
    Elements: Object.assign(FormDefaultElements, elements) as FormElementTypes,
  })

  return (
    <FormContextProvider
      value={
        {
          ...states,
          ...props,
        } as FormContextProps
      }
      memo
    >
      <FormBody />
      <FormFooter />
    </FormContextProvider>
  )
}

FormContainer.displayName = 'FormContainer'
FormContainer.whyDidYouRender = true
