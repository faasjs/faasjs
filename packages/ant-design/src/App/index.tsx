import { OptionalWrapper, useEqualEffect } from '@faasjs/react'
import { toErrorMessage } from '@faasjs/utils'
import { ConfigProvider, type ConfigProviderProps, message, notification } from 'antd'
import type { BrowserRouterProps } from 'react-router-dom'
import { BrowserRouter, useLocation } from 'react-router-dom'

import {
  ConfigProvider as FaasConfigProvider,
  type ConfigProviderProps as FaasConfigProviderProps,
} from '../Config'
import { useDrawer } from '../Drawer'
import { ErrorBoundary, type ErrorBoundaryProps } from '../ErrorBoundary'
import { useModal } from '../Modal'
import { AppContext, useApp } from '../useApp'

/**
 * Props for the root {@link App} shell.
 *
 * `App` composes Ant Design feedback APIs, the FaasJS Ant Design config layer,
 * shared modal and drawer state, error handling, and optional browser routing
 * into a single wrapper component. Use `configProviderProps` for Ant Design's
 * own `ConfigProvider`; use `faasConfigProviderProps` for the FaasJS
 * `ConfigProvider` exported by this package.
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
   * Props forwarded to React Router's `BrowserRouter`, or `false` to disable browser routing.
   *
   * Routing is enabled automatically when running in a browser and this prop is not `false`.
   *
   * @see [React Router BrowserRouterProps](https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html)
   */
  browserRouterProps?: BrowserRouterProps | false
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

function RoutesApp(props: { children: React.ReactNode }) {
  const location = useLocation()
  const { drawerProps, setDrawerProps, modalProps, setModalProps } = useApp()

  useEqualEffect(() => {
    if (drawerProps.open) setDrawerProps({ open: false })

    if (modalProps.open) setModalProps({ open: false })
  }, [location])

  return <>{props.children}</>
}

/**
 * Render the root provider shell for a FaasJS Ant Design application.
 *
 * `App` initializes Ant Design message and notification APIs, exposes hook-managed modal and
 * drawer state through {@link AppContext}, wraps descendants with {@link ErrorBoundary}, and
 * optionally mounts React Router's `BrowserRouter`. Route changes close the hook-managed modal
 * and drawer by setting their `open` prop to `false`.
 *
 * @param {AppProps} props - App shell props including providers, routing, and error handling options.
 *
 * @example
 * ```tsx
 * import { App } from '@faasjs/ant-design'
 *
 * export default function Page() {
 *   return (
 *     <App
 *       configProviderProps={{}}
 *       browserRouterProps={{}}
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
            <OptionalWrapper
              condition={typeof document !== 'undefined' && props.browserRouterProps !== false}
              Wrapper={BrowserRouter}
              wrapperProps={props.browserRouterProps}
            >
              {messageContextHolder}
              {notificationContextHolder}
              {modal}
              {drawer}
              {props.browserRouterProps !== false ? (
                <RoutesApp>{props.children}</RoutesApp>
              ) : (
                props.children
              )}
            </OptionalWrapper>
          </ErrorBoundary>
        </FaasConfigProvider>
      </AppContext.Provider>
    </OptionalWrapper>
  )
}
