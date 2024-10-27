import type { ReactNode } from 'react'
import { useFormContext } from './context'
import type { FormElementTypes } from './elements'
import type { FormInputProps } from './Input'
import type { FormRules } from './rules'

export type FormLabelProps<
  FormElements extends FormElementTypes = FormElementTypes,
> = {
  name: string
  rules?: FormRules
  label?: {
    title?: ReactNode
    description?: ReactNode
    Label?: React.ComponentType<FormLabelProps>
  }
  input?: FormInputProps<FormElements>
}

export function FormLabel(props: FormLabelProps) {
  const { elements } = useFormContext()

  if (props.label?.Label) return <props.label.Label {...props} />

  return <elements.label {...props} />
}
