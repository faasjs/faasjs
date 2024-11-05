import { FormBody } from './Body'
import { FormFooter } from './Footer'
import { type FormContextProps, FormContextProvider } from './context'
import { FormDefaultElements, type FormElementTypes } from './elements'
import type { FormLabelElementProps } from './elements/Label'
import { FormDefaultLang, type FormLang } from './lang'
import {
  FormDefaultRules,
  type FormRules,
  type InferFormRulesOptions,
} from './rules'

export type FormProps<
  Values extends Record<string, any> = Record<string, any>,
  FormElements extends FormElementTypes = FormElementTypes,
  Rules extends FormRules = typeof FormDefaultRules,
> = {
  items: FormLabelElementProps<FormElements, InferFormRulesOptions<Rules>>[]
  onSubmit?: (values: Values) => Promise<void>
  Elements?: Partial<FormElements>
  lang?: Partial<FormLang>
  defaultValues?: Values
  rules?: typeof FormDefaultRules & Rules
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
  Rules extends FormRules = typeof FormDefaultRules,
>({
  defaultValues,
  Elements,
  rules,
  lang,
  ...props
}: FormProps<Values, FormElements, Rules>) {
  return (
    <FormContextProvider
      initializeStates={{
        values: mergeValues(props.items, defaultValues),
        errors: {},
        submitting: false,
        Elements: Object.assign(
          FormDefaultElements,
          Elements
        ) as FormElementTypes,
        lang: Object.assign(FormDefaultLang, lang) as FormLang,
        rules: Object.assign(FormDefaultRules, rules),
      }}
      value={props as Partial<FormContextProps>}
      memo
    >
      <FormBody />
      <FormFooter />
    </FormContextProvider>
  )
}

FormContainer.displayName = 'FormContainer'
FormContainer.whyDidYouRender = true
