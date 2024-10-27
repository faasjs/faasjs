import type { ComponentType, ReactNode } from 'react'
import type { FormRules } from '../rules'
import { FormInputElement, type FormInputElementProps } from './Input'
import { useFormContext } from '../context'

export type FormLabelElementProps = {
  name: string
  rules?: FormRules

  title?: ReactNode
  description?: ReactNode
  Label?: React.ComponentType<FormLabelElementProps>
  input?: {
    Input?: ComponentType<FormInputElementProps>
    props?: FormInputElementProps
  }
}

export const FormLabelElement = ({
  name,
  title,
  description,
  Label,
  input,
}: FormLabelElementProps) => {
  const { values, setValues } = useFormContext()

  if (Label) return <Label name={name} title={title} description={description} input={input} />

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
          } />
      )}
      {description}
    </label>
  )
}
