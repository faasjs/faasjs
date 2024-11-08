import type { ComponentType } from 'react'
import type { FormInputProps } from './Input'
import { useFormContext } from './context'
import type { FormElementTypes } from './elements'
import type { FormLabelElementProps } from './elements/Label'
import type { FormDefaultRulesOptions } from './rules'

export type FormItemName = string

export type FormItemProps<
  FormElements extends FormElementTypes = FormElementTypes,
  FormRulesOptions extends Record<string, any> = FormDefaultRulesOptions,
> = {
  name: FormItemName
  label?: Omit<FormLabelElementProps, 'name'> & {
    Label?: ComponentType<FormLabelElementProps>
  }
  input?: FormInputProps<FormElements>
  rules?: FormRulesOptions
}

export function FormItem(props: FormItemProps) {
  const { Elements, values, setValues } = useFormContext()
  const Label = props.label?.Label ?? Elements.Label
  const Input = props.input?.Input ?? Elements.Input

  return (
    <Label name={props.name} {...props.label}>
      <Input
        name={props.name}
        value={values[props.name]}
        onChange={v =>
          setValues(prev => ({
            ...prev,
            [props.name]: v,
          }))
        }
      />
    </Label>
  )
}

FormItem.displayName = 'FormItem'
FormItem.whyDidYouRender = true
