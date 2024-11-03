import { type ButtonHTMLAttributes, forwardRef } from 'react'

export type FormButtonElementProps = {
  children?: React.ReactNode
  disabled: boolean
  submit: () => void
}

export const FormButtonElement = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & FormButtonElementProps
>(({ disabled, children, submit, ...props }, ref) => (
  <button
    type='button'
    disabled={disabled}
    onClick={submit}
    {...props}
    ref={ref}
  >
    {children}
  </button>
))

FormButtonElement.displayName = 'FormButtonElement'
FormButtonElement.whyDidYouRender = true
