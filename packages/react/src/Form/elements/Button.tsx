import { type ButtonHTMLAttributes, forwardRef } from 'react'

/**
 * Props for the FormButtonElement component.
 *
 * @property {React.ReactNode} [children] - The content to be displayed inside the button.
 * @property {boolean} disabled - Indicates whether the button is disabled.
 * @property {() => Promise<void>} submit - A function to be called when the button is clicked, which returns a promise.
 */
export type FormButtonElementProps = {
  children?: React.ReactNode
  disabled: boolean
  submit: () => Promise<void>
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
