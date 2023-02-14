import {
  ConfigProvider, message, notification
} from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import type { StyleProviderProps } from '@ant-design/cssinjs/lib/StyleContext'
import {
  createContext, useContext, useMemo
} from 'react'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'
import { ModalProps, useModal } from './Modal'
import { DrawerProps, useDrawer } from './Drawer'

export interface AppProps {
  children: React.ReactNode
  styleProviderProps?: StyleProviderProps
  configProviderProps?: ConfigProviderProps
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
  setModalProps: () => void(0),
  setDrawerProps: () => void(0),
})

export function App (props: AppProps) {
  const [messageApi, messageContextHolder] = message.useMessage()
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const { modal, setModalProps } = useModal()
  const { drawer, setDrawerProps } = useDrawer()

  const memoizedContextValue = useMemo<useAppProps>(
    () => ({
      message: messageApi,
      notification: notificationApi,
      setModalProps,
      setDrawerProps,
    }),
    [
      messageApi,
      notificationApi,
      setModalProps,
      setDrawerProps,
    ],
  )

  return <StyleProvider
    { ...Object.assign(props.styleProviderProps || {}, {
      hashPriority: 'high',
      transformers: [legacyLogicalPropertiesTransformer],
    }) }
  >
    <ConfigProvider { ...(props.configProviderProps || {}) }>
      <AppContext.Provider value={ memoizedContextValue }>
        {messageContextHolder}
        {notificationContextHolder}
        {modal}
        {drawer}
        {props.children}
      </AppContext.Provider>
    </ConfigProvider>
  </StyleProvider>
}

export function useApp () {
  return useContext<useAppProps>(AppContext)
}
