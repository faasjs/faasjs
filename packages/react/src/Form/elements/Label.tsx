import type { ReactNode } from 'react'
import type { FormElementTypes } from '.'
import type { FormInputProps } from '../Input'
import { useFormContext } from '../context'
import type { FormDefaultRulesOptions } from '../rules'
import { FormInputElement } from './Input'

export type FormLabelElementProps<
  FormElements extends FormElementTypes = FormElementTypes,
  FormRulesOptions extends Record<string, any> = FormDefaultRulesOptions,
> = {
  name: string
  rules?: FormRulesOptions

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
  const { values, setValues, errors } = useFormContext()

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
      {errors[name]?.message}
    </label>
  )
}

FormLabelElement.displayName = 'FormLabelElement'
FormLabelElement.whyDidYouRender = true
