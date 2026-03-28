import { Typography } from 'antd'
import type { JSX } from 'react'

import { useConfigContext } from './Config'

/**
 * Props for the {@link Blank} placeholder component.
 */
export interface BlankProps {
  /** Value to render when it is present. */
  value?: any
  /** Placeholder text shown when `value` is empty. */
  text?: string
}

/**
 * Render a disabled placeholder when a value is empty.
 *
 * Empty values include `undefined`, `null`, empty strings, and empty arrays.
 *
 * @param {BlankProps} [options] - Placeholder text and value to render.
 * @returns Rendered value or the configured placeholder text.
 *
 * @example
 * ```tsx
 * import { Blank } from '@faasjs/ant-design'
 *
 * export function FieldPreview() {
 *   return <Blank value={undefined} text="Empty" />
 * }
 * ```
 */
export function Blank(options?: BlankProps): JSX.Element {
  const { theme } = useConfigContext()

  return !options ||
    options.value === undefined ||
    options.value === null ||
    (Array.isArray(options.value) && !options.value.length) ||
    options.value === '' ? (
    <Typography.Text disabled>{options?.text || theme.Blank.text}</Typography.Text>
  ) : (
    options.value
  )
}
