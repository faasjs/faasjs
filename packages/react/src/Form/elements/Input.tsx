import { type InputHTMLAttributes, forwardRef } from 'react'

/**
 * Props for the Form Input Element component.
 *
 * @property {string} name - The name of the input element.
 * @property {any} value - The current value of the input element.
 * @property {(value: any) => void} onChange - Callback function to handle changes to the input value.
 */
export type FormInputElementProps = {
  name: string
  value: any
  onChange: (value: any) => void
}

export const FormInputElement = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
    FormInputElementProps
>(({ onChange, ...props }, ref) => (
  <input {...props} onChange={e => onChange(e.target.value)} ref={ref} />
))

FormInputElement.displayName = 'FormInputElement'
FormInputElement.whyDidYouRender = true
