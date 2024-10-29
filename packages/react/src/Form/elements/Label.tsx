import type { ReactNode } from 'react'
import type { FormRules } from '../rules'
import { FormInputElement } from './Input'
import { useFormContext } from '../context'
import type { FormElementTypes } from '.'
import type { FormInputProps } from '../Input'

export type FormLabelElementProps<
  FormElements extends FormElementTypes = FormElementTypes,
> = {
  name: string
  rules?: FormRules

  title?: ReactNode
  description?: ReactNode

  Label?: FormElements['Label']
  input?: FormInputProps<FormElements>
}

export const FormLabelElement = ({
  name,
  title,
  description,
  Label,
  input,
}: FormLabelElementProps) => {
  const { values, setValues } = useFormContext()

  if (Label)
    return (
      <Label
        name={name}
        title={title}
        description={description}
        input={input}
      />
    )

  return (
    <label>
      {title ?? name}
      {input?.Input ? (
        <input.Input
          name={name}
          value={values[name]}
          onChange={v =>
            setValues(prev => ({
              ...prev,
              [name]: v,
            }))
          }
        />
      ) : (
        <FormInputElement
          name={name}
          value={values[name]}
          onChange={v =>
            setValues(prev => ({
              ...prev,
              [name]: v,
            }))
          }
        />
      )}
      {description}
    </label>
  )
}
