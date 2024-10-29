import { type ButtonHTMLAttributes, forwardRef } from 'react'

export type FormButtonElementProps = {
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export const FormButtonElement = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & FormButtonElementProps
>(({ disabled, children, onClick, ...props }, ref) => (
  <button
    type='button'
    disabled={disabled}
    onClick={onClick}
    {...props}
    ref={ref}
  >
    {children}
  </button>
))

FormButtonElement.displayName = 'FormButtonElement'
FormButtonElement.whyDidYouRender = true
