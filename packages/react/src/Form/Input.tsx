import type { ComponentProps, ComponentType, JSXElementConstructor } from 'react'
import { useFormContext } from './context'
import type { FormElementTypes } from './elements'
import type { FormRules } from './rules'

export type FormInputComponentProps = {
  name: string
  value: any
  onChange: (value: any) => void
}

export type FormInputComponent<Extra extends Record<string, any> = Record<string, any>> = ComponentType<FormInputComponentProps & Extra>

export type InferFormInputProps<T extends FormInputComponent | JSXElementConstructor<any>> = T extends FormInputComponent ? Omit<ComponentProps<T>, 'name' | 'value' | 'onChange'> : Omit<ComponentProps<T>, 'name' | 'value'>

export type FormInputProps<
  FormElements extends FormElementTypes = FormElementTypes,
> =
  | {
    Input: FormInputComponent
  }
  | {
    type?: 'input'
    props?: InferFormInputProps<FormElements['input']>
  }
  | {
    type: 'select'
    props?: InferFormInputProps<FormElements['select']>
  }

function processValue(input: any, rules?: FormRules) {
  let value = input
  if (typeof input === 'object' && 'target' in input) {
    value = input.target.value
  }

  switch (rules?.type) {
    case 'number':
      return Number(value)
    case 'string':
      return String(value)
    default:
      return value
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
  const { elements, values, setValues } = useFormContext()

  const value = values?.[name]

  if ('Input' in rest && rest.Input) {
    return (
      <rest.Input
        name={name}
        value={value}
        onChange={v =>
          setValues(prev => ({
            ...prev,
            [name]: v,
          }))
        }
      />
    )
  }

  if ('type' in rest || 'props' in rest) {
    switch (rest.type) {
      case 'select':
        return (
          <elements.select
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
      default:
        return (
          <elements.input
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
  }

  return (
    <elements.input
      name={name}
      value={value}
      onChange={v =>
        setValues(prev => ({
          ...prev,
          [name]: processValue(v, rules),
        }))
      }
    />
  )
}
