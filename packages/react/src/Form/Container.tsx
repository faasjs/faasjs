import { FormBody } from './Body'
import { FormFooter } from './Footer'
import type { FormItemProps } from './Item'
import { type FormContextProps, FormContextProvider } from './context'
import { FormDefaultElements, type FormElementTypes } from './elements'
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
  items: FormItemProps<FormElements, InferFormRulesOptions<Rules>>[]
  onSubmit?: (values: Values) => Promise<void>
  Elements?: Partial<FormElements>
  lang?: Partial<FormLang>
  defaultValues?: Values
  rules?: typeof FormDefaultRules & Rules
}

function mergeValues<Values extends Record<string, any>>(
  items: FormItemProps[],
  defaultValues: Values = {} as Values
) {
  const values = {} as Values

  for (const item of items)
    values[item.name as keyof Values] = defaultValues[item.name] ?? ''

  return values
}

/**
 * FormContainer component is a wrapper that provides context and state management for form elements.
 * It initializes form states such as values, errors, submitting status, elements, language, and rules.
 *
 * @template Values - The type of form values, defaults to Record<string, any>.
 * @template FormElements - The type of form elements, defaults to FormElementTypes.
 * @template Rules - The type of form rules, defaults to FormDefaultRules.
 *
 * @param {FormProps<Values, FormElements, Rules>} props - The properties for the FormContainer component.
 * @param {Values} props.defaultValues - The default values for the form fields.
 * @param {FormElements} props.Elements - The form elements to be used in the form.
 * @param {Rules} props.rules - The validation rules for the form fields.
 * @param {FormLang} props.lang - The language settings for the form.
 * @param {Partial<FormContextProps>} props - Additional properties for the form context.
 *
 * @returns {JSX.Element} The FormContainer component.
 */
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
