import { useEqualCallback } from '@faasjs/react'
import { type DrawerProps as AntdDrawerProps, Drawer } from 'antd'
import { type Dispatch, type JSX, type SetStateAction, useState } from 'react'

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
 * updater function, into the existing drawer props. Omitted keys are preserved;
 * set a key to `undefined` or a new value when you need to clear or replace it.
 */
export type setDrawerProps = Dispatch<SetStateAction<DrawerProps>>

/**
 * Create a hook-managed Ant Design drawer instance.
 *
 * The returned setter shallow-merges partial updates into the drawer props instead
 * of replacing the entire state object. The updater form is also merged after it
 * returns, so omitted keys stay unchanged.
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
  const [props, setProps] = useState<DrawerProps>({
    open: false,
    destroyOnHidden: true,
    ...init,
  })

  const setDrawerProps: setDrawerProps = useEqualCallback(
    (changes) => {
      const changed = typeof changes === 'function' ? changes(props) : changes

      setProps((prev) => ({ ...prev, ...changed }))
    },
    [setProps],
  )

  return {
    drawer: (
      <Drawer
        onClose={() =>
          setProps((prev) => ({
            ...prev,
            open: false,
          }))
        }
        {...props}
      />
    ),
    drawerProps: props,
    setDrawerProps,
  }
}
