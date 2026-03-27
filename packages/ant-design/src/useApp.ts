import { createSplittingContext } from '@faasjs/react'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'

import type { DrawerProps, setDrawerProps } from './Drawer'
import type { ModalProps, setModalProps } from './Modal'

/**
 * Shared app services exposed by {@link AppContext} and {@link useApp}.
 */
export interface useAppProps {
  message: MessageInstance
  notification: NotificationInstance
  modalProps: ModalProps
  setModalProps: setModalProps
  drawerProps: DrawerProps
  setDrawerProps: setDrawerProps
}

/**
 * Shared context storing message, notification, modal, and drawer helpers.
 */
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
 * @template NewT - Narrowed app context shape to read from `AppContext`.
 * @param this - Unused receiver to keep the hook callable without binding.
 *
 * @example
 * ```ts
 * import { App, useApp } from '@faasjs/ant-design'
 * import { Button } from 'antd'
 *
 * function Page() {
 *   const { message, setModalProps } = useApp()
 *
 *   return (
 *     <Button
 *       onClick={() => {
 *         message.success('Saved')
 *         setModalProps({ open: true, title: 'Done', children: 'Profile updated.' })
 *       }}
 *     >
 *       Save
 *     </Button>
 *   )
 * }
 *
 * <App>
 *   <Page />
 * </App>
 * ```
 */
export function useApp<NewT extends useAppProps = useAppProps>(this: void): Readonly<NewT> {
  return AppContext.use<NewT>()
}
