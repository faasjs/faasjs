import type { ComponentType } from 'react'
import { useFormContext } from './context'
import type { FormElementTypes } from './elements'
import type { FormLabelElementProps } from './elements/Label'
import { FormInput, type FormInputProps } from './Input'
import type { FormDefaultRulesOptions } from './rules'

export type FormItemName = string

export type FormItemProps<
  FormElements extends FormElementTypes = FormElementTypes,
  FormRulesOptions extends Record<string, any> = FormDefaultRulesOptions,
> = {
  name: FormItemName
  label?: Omit<FormLabelElementProps, 'name' | 'children'> & {
    Label?: ComponentType<FormLabelElementProps>
  }
  input?: FormInputProps<FormElements>
  rules?: FormRulesOptions
}

export function FormItem(props: FormItemProps) {
  const { Elements, errors } = useFormContext()
  const Label = props.label?.Label ?? Elements.Label

  return (
    <Label name={props.name} {...props.label} error={errors[props.name]}>
      <FormInput
        name={props.name}
        {...props.input}
        {...(props.rules ? { rules: props.rules } : {})}
      />
    </Label>
  )
}

FormItem.displayName = 'FormItem'
