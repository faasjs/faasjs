import type {
  ComponentProps,
  ComponentType,
  JSXElementConstructor,
} from 'react'
import { useFormContext } from './context'
import type { FormElementTypes } from './elements'
import type { FormRules } from './rules'
import type { FormInputElementProps } from './elements/Input'

export type InferFormInputProps<
  T extends ComponentType<FormInputElementProps> | JSXElementConstructor<any>,
> = T extends ComponentType<FormInputElementProps>
  ? Omit<ComponentProps<T>, 'name' | 'value' | 'onChange'>
  : Omit<ComponentProps<T>, 'name' | 'value'>

export type FormInputProps<
  FormElements extends FormElementTypes = FormElementTypes,
> = {
  Input?: ComponentType<FormInputElementProps>
  props?: InferFormInputProps<FormElements['Input']>
}

function processValue(input: any, rules?: FormRules) {
  switch (rules?.type) {
    case 'number':
      return Number(input)
    case 'string':
      return String(input)
    default:
      return input
  }
}

export function FormInput({
  name,
  rules,
  ...rest
}: FormInputProps & {
  name: string
  rules?: FormRules
}) {
  const { Elements, values, setValues } = useFormContext()

  const value = values?.[name]

  if (rest.Input) {
    return (
      <rest.Input
        name={name}
        value={value}
        onChange={v =>
          setValues(prev => ({
            ...prev,
            [name]: processValue(v, rules),
          }))
        }
        {...rest.props}
      />
    )
  }

  return (
    <Elements.Input
      name={name}
      value={value}
      onChange={v =>
        setValues(prev => ({
          ...prev,
          [name]: processValue(v, rules),
        }))
      }
      {...rest.props}
    />
  )
}
