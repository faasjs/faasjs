import type { ReactNode } from 'react'

/**
 * Props for the FormLabelElement component.
 *
 * @typedef {Object} FormLabelElementProps
 * @property {string} name - The name of the form element.
 * @property {ReactNode} [title] - Optional title for the form element.
 * @property {ReactNode} [description] - Optional description for the form element.
 * @property {Error} [error] - Optional error associated with the form element.
 * @property {ReactNode} children - The child elements, typically an input element.
 */
export type FormLabelElementProps = {
  name: string

  title?: ReactNode
  description?: ReactNode
  error?: Error

  /** as Input element */
  children: ReactNode
}

export const FormLabelElement = ({
  name,
  title,
  description,
  error,
  children,
}: FormLabelElementProps) => {
  return (
    <label>
      {title ?? name}
      {children}
      {description}
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
    </label>
  )
}

FormLabelElement.displayName = 'FormLabelElement'
