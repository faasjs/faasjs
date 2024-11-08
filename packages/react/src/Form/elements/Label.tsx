import type { ReactNode } from 'react'

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
FormLabelElement.whyDidYouRender = true
