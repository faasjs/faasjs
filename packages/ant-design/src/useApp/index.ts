import { createSplittingContext } from '@faasjs/react'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'

import type { DrawerProps, setDrawerProps } from '../Drawer'
import type { ModalProps, setModalProps } from '../Modal'

/**
 * Shared app services exposed by {@link AppContext} and {@link useApp}.
 */
export interface useAppProps {
  /** Ant Design message API instance created by the root `App` component. */
  message: MessageInstance
  /** Ant Design notification API instance created by the root `App` component. */
  notification: NotificationInstance
  /** Current props of the hook-managed modal element. */
  modalProps: ModalProps
  /** Setter that merges updates into the hook-managed modal props. */
  setModalProps: setModalProps
  /** Current props of the hook-managed drawer element. */
  drawerProps: DrawerProps
  /** Setter that merges updates into the hook-managed drawer props. */
  setDrawerProps: setDrawerProps
}

/**
 * Shared context storing message, notification, modal, and drawer helpers.
 *
 * @example
 * ```ts
 * const { message } = AppContext.use()
 * ```
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
 * Read app-level services exposed by the root `App` component.
 *
 * @template NewT - Narrowed app context shape to read from `AppContext`.
 * @param {void} this - Explicit void receiver that keeps the hook unbound.
 * @returns Read-only app context value.
 *
 * @example
 * ```tsx
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
 * export function Root() {
 *   return (
 *     <App>
 *       <Page />
 *     </App>
 *   )
 * }
 * ```
 */
export function useApp<NewT extends useAppProps = useAppProps>(this: void): Readonly<NewT> {
  return AppContext.use<NewT>()
}
