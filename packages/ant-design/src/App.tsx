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
  styleProviderProps?: StyleProviderProps
  configProviderProps?: ConfigProviderProps
  browserRouterProps?: BrowserRouterProps
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
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

export function App(props: AppProps) {
  const [messageApi, messageContextHolder] = message.useMessage()
  const [notificationApi, notificationContextHolder] =
    notification.useNotification()
  const { modal, setModalProps } = useModal()
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

  return (
    <StyleProvider
      {...Object.assign(props.styleProviderProps || {}, {
        hashPriority: 'high',
        transformers: [legacyLogicalPropertiesTransformer],
      })}
    >
      <ConfigProvider {...props.configProviderProps}>
        <AppContext.Provider value={memoizedContextValue}>
          <FaasConfigProvider config={props.faasConfigProviderProps || {}}>
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
