import { type DrawerProps as AntdDrawerProps, Drawer } from 'antd'
import { type Dispatch, type JSX, type SetStateAction } from 'react'

import { useDialogProps } from '../utils/use-dialog-props'

export { Drawer }

/**
 * Props accepted by the hook-managed drawer wrapper.
 */
export interface DrawerProps extends AntdDrawerProps {
  /** Drawer body content managed by {@link useDrawer}. */
  children?: JSX.Element | JSX.Element[]
}

/**
 * State setter used to update hook-managed drawer props.
 *
 * Each call shallow-merges the provided object, or the object returned by an
 * updater function, into the existing drawer props. When `open` is set to
 * `false`, previous drawer props are discarded and the drawer resets to its
 * initial props.
 */
export type setDrawerProps = Dispatch<SetStateAction<DrawerProps>>

/**
 * Create a hook-managed Ant Design drawer instance.
 *
 * The returned setter shallow-merges partial updates into the drawer props. When
 * an update sets `open` to `false`, previous drawer props are discarded and the
 * drawer resets to its initial props.
 *
 * @param {DrawerProps} [init] - Initial drawer props.
 * @returns Hook-managed drawer element, current props, and a state-merging setter.
 *
 * @example
 * ```tsx
 * import { useDrawer } from '@faasjs/ant-design'
 * import { Button } from 'antd'
 *
 * function Example() {
 *   const { drawer, setDrawerProps } = useDrawer()
 *
 *   return (
 *     <>
 *       <Button onClick={() => setDrawerProps({ open: true, title: 'Details', children: <div>Content</div> })}>
 *         Open
 *       </Button>
 *       {drawer}
 *     </>
 *   )
 * }
 * ```
 */
export function useDrawer(init?: DrawerProps) {
  const [drawerProps, setDrawerProps] = useDialogProps(init)

  return {
    drawer: <Drawer onClose={() => setDrawerProps({ open: false })} {...drawerProps} />,
    drawerProps,
    setDrawerProps,
  }
}
