import { Typography } from 'antd'
import { isNil } from 'lodash-es'
import { useConfigContext } from './Config'

export interface BlankProps {
  value?: any
  text?: string
}

/**
 * Blank component.
 *
 * If value is undefined or null, return text, otherwise return value.
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
    isNil(options.value) ||
    (Array.isArray(options.value) && !options.value.length) ||
    options.value === '' ? (
    <Typography.Text disabled>
      {options?.text || theme.Blank.text}
    </Typography.Text>
  ) : (
    options.value
  )
}
