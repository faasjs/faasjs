import { OptionalWrapper } from '@faasjs/react'
import { toErrorMessage } from '@faasjs/utils'
import { ConfigProvider, type ConfigProviderProps, message, notification } from 'antd'

import {
  ConfigProvider as FaasConfigProvider,
  type ConfigProviderProps as FaasConfigProviderProps,
} from '../Config'
import { useDrawer } from '../Drawer'
import { ErrorBoundary, type ErrorBoundaryProps } from '../ErrorBoundary'
import { useModal } from '../Modal'
import { AppContext } from '../useApp'

/**
 * Props for the root {@link App} shell.
 *
 * `App` composes Ant Design feedback APIs, the FaasJS Ant Design config layer,
 * shared modal and drawer state, and error handling into a single wrapper
 * component. Use `configProviderProps` for Ant Design's own `ConfigProvider`;
 * use `faasConfigProviderProps` for the FaasJS `ConfigProvider` exported by
 * this package.
 */
export interface AppProps {
  /** Descendant elements rendered inside all configured providers. */
  children: React.ReactNode
  /**
   * Props forwarded to Ant Design's `ConfigProvider`.
   *
   * Omit this prop when you do not need Ant Design token, locale, direction, or
   * component config overrides from this root shell.
   *
   * @see [Ant Design ConfigProvider API](https://ant.design/components/config-provider/#API)
   */
  configProviderProps?: ConfigProviderProps
  /**
   * Props forwarded to {@link ErrorBoundary}.
   *
   * @see [FaasJS Ant Design ErrorBoundary docs](https://faasjs.com/doc/ant-design/#errorboundary)
   */
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
  /**
   * Props forwarded to the FaasJS Ant Design {@link ConfigProvider}.
   *
   * `App` still mounts the FaasJS config layer so descendants can read theme
   * defaults. Pass `false` to use only the built-in defaults and App's default
   * `onError` handler.
   *
   * @see [FaasJS Ant Design ConfigProvider docs](https://faasjs.com/doc/ant-design/#configprovider)
   */
  faasConfigProviderProps?: Omit<FaasConfigProviderProps, 'children'> | false
}

/**
 * Create the default FaasJS request error handler used by {@link App}.
 *
 * The handler ignores aborted requests, logs other failures with the action path,
 * and shows the normalized message through Ant Design's message API.
 *
 * @param messageApi - Ant Design message API subset used to show errors.
 * @returns Error handler factory compatible with `FaasReactClientOptions.onError`.
 */
export function createOnErrorHandler(messageApi: { error: (message: string) => void }) {
  return (action: string) => async (res: any) => {
    if ('message' in res && res.toString().includes('AbortError')) return

    console.error(`[FaasJS][${action}]`, res)

    messageApi.error(toErrorMessage(res))
  }
}

/**
 * Render the root provider shell for a FaasJS Ant Design application.
 *
 * `App` initializes Ant Design message and notification APIs, exposes hook-managed modal and
 * drawer state through {@link AppContext}, and wraps descendants with {@link ErrorBoundary}.
 *
 * @param {AppProps} props - App shell props including providers and error handling options.
 *
 * @example
 * ```tsx
 * import { App } from '@faasjs/ant-design'
 *
 * export default function Page() {
 *   return (
 *     <App
 *       configProviderProps={{}}
 *       errorBoundaryProps={{}}
 *       faasConfigProviderProps={{}}
 *     >
 *       <div>content</div>
 *     </App>
 *   )
 * }
 * ```
 */
export function App(props: AppProps) {
  const [messageApi, messageContextHolder] = message.useMessage()
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const { modal, modalProps, setModalProps } = useModal({
    destroyOnHidden: true,
  })
  const { drawer, drawerProps, setDrawerProps } = useDrawer({
    destroyOnHidden: true,
  })

  return (
    <OptionalWrapper
      condition={!!props.configProviderProps}
      Wrapper={ConfigProvider}
      wrapperProps={props.configProviderProps}
    >
      <AppContext.Provider
        value={{
          message: messageApi,
          notification: notificationApi,
          drawerProps,
          setDrawerProps,
          modalProps,
          setModalProps,
        }}
      >
        <FaasConfigProvider
          {...props.faasConfigProviderProps}
          faasClientOptions={{
            onError: createOnErrorHandler(messageApi),
            ...(props.faasConfigProviderProps
              ? props.faasConfigProviderProps.faasClientOptions
              : {}),
          }}
        >
          <ErrorBoundary {...props.errorBoundaryProps}>
            {messageContextHolder}
            {notificationContextHolder}
            {modal}
            {drawer}
            {props.children}
          </ErrorBoundary>
        </FaasConfigProvider>
      </AppContext.Provider>
    </OptionalWrapper>
  )
}
