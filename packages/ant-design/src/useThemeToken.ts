import { type GlobalToken, theme } from 'antd'

/**
 * Read the current Ant Design theme token.
 *
 * @returns Ant Design global token object for the active theme.
 *
 * @example
 * ```tsx
 * import { useThemeToken } from '@faasjs/ant-design'
 *
 * function PrimarySwatch() {
 *   const { colorPrimary } = useThemeToken()
 *
 *   return <div style={{ width: 24, height: 24, background: colorPrimary }} />
 * }
 * ```
 */
export function useThemeToken(): GlobalToken {
  const config = theme.useToken()

  return config.token
}
