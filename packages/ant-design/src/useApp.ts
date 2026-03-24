import { createSplittingContext } from '@faasjs/react'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'

import type { DrawerProps, setDrawerProps } from './Drawer'
import type { ModalProps, setModalProps } from './Modal'

export interface useAppProps {
  message: MessageInstance
  notification: NotificationInstance
  modalProps: ModalProps
  setModalProps: setModalProps
  drawerProps: DrawerProps
  setDrawerProps: setDrawerProps
}

export const AppContext = createSplittingContext<useAppProps>([
  'message',
  'notification',
  'modalProps',
  'setModalProps',
  'drawerProps',
  'setDrawerProps',
])

/**
 * Get app context.
 *
 * ```ts
 * import { useApp } from '@faasjs/ant-design'
 *
 * const { message, notification, setModalProps, setDrawerProps } = useApp()
 * ```
 */
export function useApp<NewT extends useAppProps = useAppProps>(this: void): Readonly<NewT> {
  return AppContext.use<NewT>()
}
