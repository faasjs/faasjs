import {
  StyleProvider,
  type StyleProviderProps,
  legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs'
import {
  OptionalWrapper,
  createSplittingContext,
  useEqualEffect,
  useEqualMemo,
} from '@faasjs/react'
import {
  ConfigProvider,
  type ConfigProviderProps,
  message,
  notification,
} from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'
import { BrowserRouter, useLocation } from 'react-router-dom'
import type { BrowserRouterProps } from 'react-router-dom'
import {
  ConfigProvider as FaasConfigProvider,
  type ConfigProviderProps as FaasConfigProviderProps,
} from './Config'
import { type DrawerProps, type setDrawerProps, useDrawer } from './Drawer'
import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary'
import { type ModalProps, type setModalProps, useModal } from './Modal'

export interface AppProps {
  children: React.ReactNode
  /**
   * `false` to disable StyleProvider.
   *
   * @see https://github.com/ant-design/cssinjs?tab=readme-ov-file#styleprovider
   */
  styleProviderProps?: StyleProviderProps | false
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

export interface useAppProps {
  message: MessageInstance
  notification: NotificationInstance
  modalProps: ModalProps
  setModalProps: setModalProps
  drawerProps: DrawerProps
  setDrawerProps: setDrawerProps
}

const AppContext = createSplittingContext<useAppProps>({
  message: null,
  notification: null,
  modalProps: {},
  setModalProps: null,
  drawerProps: {},
  setDrawerProps: null,
})

function RoutesApp(props: {
  children: React.ReactNode
}) {
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
 * - Based on Ant Design's [ConfigProvider](https://ant.design/components/config-provider/) and [StyleProvider](https://ant.design/docs/react/compatible-style#styleprovider).
 * - Integrated Ant Design's [Message](https://ant.design/components/message/) and [Notification](https://ant.design/components/notification/).
 * - Based on FaasJS's [ConfigProvider](https://faasjs.com/doc/ant-design/#configprovider).
 * - Integrated FaasJS's [Modal](https://faasjs.com/doc/ant-design/#usemodal), [Drawer](https://faasjs.com/doc/ant-design/#usedrawer) and [ErrorBoundary](https://faasjs.com/doc/ant-design/#errorboundary).
 * - Integrated React Router's [BrowserRouter](https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html).
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
 *      browserRouterProps={{}} // https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html
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
  const { drawer, drawerProps, setDrawerProps } = useDrawer()

  const styleProviderProps = useEqualMemo(
    () => ({
      hashPriority: 'high' as const,
      transformers: [legacyLogicalPropertiesTransformer],
      ...props.styleProviderProps,
    }),
    [props.styleProviderProps]
  )

  return (
    <OptionalWrapper
      condition={props.styleProviderProps !== false}
      Wrapper={StyleProvider}
      wrapperProps={styleProviderProps}
    >
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
              onError: action => async res => {
                if ('message' in res && res.toString().includes('AbortError'))
                  return

                console.error(`[FaasJS][${action}]`, res)

                messageApi.error(
                  'message' in res ? res.message : 'Unknown error'
                )
              },
              ...(props.faasConfigProviderProps
                ? props.faasConfigProviderProps.faasClientOptions
                : {}),
            }}
          >
            <ErrorBoundary {...props.errorBoundaryProps}>
              <OptionalWrapper
                condition={
                  typeof document !== 'undefined' &&
                  props.browserRouterProps !== false
                }
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
    </OptionalWrapper>
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
export const useApp = AppContext.use

App.useApp = useApp
App.whyDidYouRender = true
