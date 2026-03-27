import { Typography } from 'antd'
import type { JSX } from 'react'

import { useConfigContext } from './Config'

/**
 * Props for the {@link Blank} placeholder component.
 */
export interface BlankProps {
  value?: any
  text?: string
}

/**
 * Blank component.
 *
 * If value is undefined or null, return text, otherwise return value.
 *
 * @param options - Placeholder text and value to render.
 *
 * @example
 * ```tsx
 * import { Blank } from '@faasjs/ant-design'
 *
 * <Blank value={undefined} text="Empty" />
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
