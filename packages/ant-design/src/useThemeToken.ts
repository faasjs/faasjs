import { type GlobalToken, theme } from 'antd'

/**
 * Hook to retrieve the theme token from the Ant Design theme configuration.
 *
 * This function uses the `theme.useToken` method to get the current theme configuration
 * and returns the `token` property from the configuration.
 *
 * @returns {GlobalToken} The theme token from the Ant Design theme configuration.
 */
export function useThemeToken(): GlobalToken {
  const config = theme.useToken()

  return config.token
}
