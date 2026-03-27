import { OptionalWrapper, useEqualEffect } from '@faasjs/react'
import { ConfigProvider, type ConfigProviderProps, message, notification } from 'antd'
import type { BrowserRouterProps } from 'react-router-dom'
import { BrowserRouter, useLocation } from 'react-router-dom'

import {
  ConfigProvider as FaasConfigProvider,
  type ConfigProviderProps as FaasConfigProviderProps,
} from './Config'
import { useDrawer } from './Drawer'
import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary'
import { useModal } from './Modal'
import { AppContext, useApp } from './useApp'

/**
 * Props for the root {@link App} shell.
 */
export interface AppProps {
  children: React.ReactNode
  /** @see https://ant.design/components/config-provider/#API */
  configProviderProps?: ConfigProviderProps
  /**
   * `false` to disable BrowserRouter.
   *
   * Auto disable when not in browser.
   *
   * @see https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html
   */
  browserRouterProps?: BrowserRouterProps | false
  /** @see https://faasjs.com/doc/ant-design/#errorboundary */
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
  /** @see https://faasjs.com/doc/ant-design/#configprovider */
  faasConfigProviderProps?: Omit<FaasConfigProviderProps, 'children'> | false
}

function RoutesApp(props: { children: React.ReactNode }) {
  const location = useLocation()
  const { drawerProps, setDrawerProps, modalProps, setModalProps } = useApp()

  useEqualEffect(() => {
    console.debug('location', location)

    if (drawerProps.open) setDrawerProps({ open: false })

    if (modalProps.open) setModalProps({ open: false })
  }, [location])

  return <>{props.children}</>
}

/**
 * App component with Ant Design & FaasJS
 *
 * - Based on Ant Design's [ConfigProvider](https://ant.design/components/config-provider/).
 * - Integrated Ant Design's [Message](https://ant.design/components/message/) and [Notification](https://ant.design/components/notification/).
 * - Based on FaasJS's [ConfigProvider](https://faasjs.com/doc/ant-design/#configprovider).
 * - Integrated FaasJS's [Modal](https://faasjs.com/doc/ant-design/#usemodal), [Drawer](https://faasjs.com/doc/ant-design/#usedrawer) and [ErrorBoundary](https://faasjs.com/doc/ant-design/#errorboundary).
 * - Integrated React Router's [BrowserRouter](https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html).
 *
 * @param {AppProps} props - App shell props including providers, routing, and error handling options.
 *
 * @example
 * ```tsx
 * import { App } from '@faasjs/ant-design'
 *
 * export default function () {
 *   return (
 *     <App
 *      configProviderProps={{}} // https://ant.design/components/config-provider/#API
 *      browserRouterProps={{}} // https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html
 *      errorBoundaryProps={{}} // https://faasjs.com/doc/ant-design/#errorboundary
 *      faasConfigProviderProps={{}} // https://faasjs.com/doc/ant-design/#configprovider
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
  const { modal, modalProps, setModalProps } = useModal()
  const { drawer, drawerProps, setDrawerProps } = useDrawer()

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
            onError: (action) => async (res) => {
              if ('message' in res && res.toString().includes('AbortError')) return

              console.error(`[FaasJS][${action}]`, res)

              messageApi.error('message' in res ? res.message : 'Unknown error')
            },
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
