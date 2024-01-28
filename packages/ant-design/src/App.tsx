import { ConfigProvider, message, notification } from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs'
import type { StyleProviderProps } from '@ant-design/cssinjs/lib/StyleContext'
import { createContext, useContext, useEffect, useMemo } from 'react'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'
import { ModalProps, useModal } from './Modal'
import { DrawerProps, useDrawer } from './Drawer'
import { BrowserRouter, useLocation } from 'react-router-dom'
import type { BrowserRouterProps } from 'react-router-dom'
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary'
import {
  ConfigProvider as FaasConfigProvider,
  ConfigProviderProps as FaasConfigProviderProps,
} from './Config'

export interface AppProps {
  children: React.ReactNode
  /** https://ant.design/docs/react/compatible-style#styleprovider */
  styleProviderProps?: StyleProviderProps
  /** https://ant.design/components/config-provider/#API */
  configProviderProps?: ConfigProviderProps
  /** https://reactrouter.com/en/router-components/browser-router */
  browserRouterProps?: BrowserRouterProps
  /** https://faasjs.com/doc/ant-design/#errorboundary */
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
  /** https://faasjs.com/doc/ant-design/#configprovider */
  faasConfigProviderProps?: Omit<FaasConfigProviderProps, 'children'>
}

export interface useAppProps {
  message: MessageInstance
  notification: NotificationInstance
  setModalProps: (changes: Partial<ModalProps>) => void
  setDrawerProps: (changes: Partial<DrawerProps>) => void
}

const AppContext = createContext<useAppProps>({
  message: {} as MessageInstance,
  notification: {} as NotificationInstance,
  setModalProps: () => void 0,
  setDrawerProps: () => void 0,
})

function RoutesApp(props: {
  children: React.ReactNode
}) {
  const location = useLocation()
  const { setDrawerProps, setModalProps } = useApp()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.debug('location', location)
    setDrawerProps({ open: false })
    setModalProps({ open: false })
  }, [location])

  return <>{props.children}</>
}

/**
 * App component with Ant Design & FaasJS
 *
 * - Based on Ant Design's [ConfigProvider](https://ant.design/components/config-provider/) and [StyleProvider](https://ant.design/components/style-provider/).
 * - Integrated Ant Design's [Message](https://ant.design/components/message/) and [Notification](https://ant.design/components/notification/).
 * - Based on FaasJS's [ConfigProvider](https://faasjs.com/doc/ant-design/#configprovider).
 * - Integrated FaasJS's [Modal](https://faasjs.com/doc/ant-design/#usemodal), [Drawer](https://faasjs.com/doc/ant-design/#usedrawer) and [ErrorBoundary](https://faasjs.com/doc/ant-design/#errorboundary).
 * - Integrated React Router's [BrowserRouter](https://reactrouter.com/en/router-components/browser-router).
 *
 * @example
 * ```tsx
 * import { App } from '@faasjs/ant-design'
 *
 * export default function () {
 *   return (
 *     <App
 *      styleProviderProps={{}} // https://ant.design/docs/react/compatible-style#styleprovider
 *      configProviderProps={{}} // https://ant.design/components/config-provider/#API
 *      browserRouterProps={{}} // https://reactrouter.com/en/router-components/browser-router
 *      errorBoundaryProps={{}} // https://faasjs.com/doc/ant-design/#errorboundary
 *      faasConfigProviderProps={{}} // https://faasjs.com/doc/ant-design/#configprovider
 *     >
 *       <div>content</div>
 *     </App>
 *   )
 * ```
 */
export function App(props: AppProps) {
  const [messageApi, messageContextHolder] = message.useMessage()
  const [notificationApi, notificationContextHolder] =
    notification.useNotification()
  const { modal, modalProps, setModalProps } = useModal()
  const { drawer, setDrawerProps } = useDrawer()

  const memoizedContextValue = useMemo<useAppProps>(
    () => ({
      message: messageApi,
      notification: notificationApi,
      setModalProps,
      setDrawerProps,
    }),
    [messageApi, notificationApi, setModalProps, setDrawerProps]
  )

  const styleProviderProps = useMemo(
    () => ({
      ...props.styleProviderProps,
      hashPriority: 'high' as const,
      transformers: [legacyLogicalPropertiesTransformer],
    }),
    [props.styleProviderProps]
  )

  return (
    <StyleProvider {...styleProviderProps}>
      <ConfigProvider {...props.configProviderProps}>
        <AppContext.Provider value={memoizedContextValue}>
          <FaasConfigProvider {...props.faasConfigProviderProps}>
            <ErrorBoundary {...props.errorBoundaryProps}>
              <BrowserRouter {...props.browserRouterProps}>
                {messageContextHolder}
                {notificationContextHolder}
                {modal}
                {drawer}
                <RoutesApp>{props.children}</RoutesApp>
              </BrowserRouter>
            </ErrorBoundary>
          </FaasConfigProvider>
        </AppContext.Provider>
      </ConfigProvider>
    </StyleProvider>
  )
}

/**
 * Get app context.
 *
 * ```ts
 * import { useApp } from '@faasjs/ant-design'
 *
 * const { message, notification, setModalProps, setDrawerProps } = useApp()
 * ```
 */
export function useApp() {
  return useContext<useAppProps>(AppContext)
}

App.useApp = useApp
App.whyDidYouRender = true
