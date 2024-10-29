import { forwardRef, type InputHTMLAttributes } from 'react'

export type FormInputElementProps = {
  name: string
  value: any
  onChange: (value: any) => void
}

export const FormInputElement = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & FormInputElementProps
>(({ onChange, ...props }, ref) => <input {...props} onChange={e => onChange(e.target.value)} ref={ref} />)

FormInputElement.displayName = 'FormInputElement'
FormInputElement.whyDidYouRender = true
