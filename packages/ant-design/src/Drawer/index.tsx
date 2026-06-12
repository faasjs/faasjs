import { useEqualCallback } from '@faasjs/react'
import { type DrawerProps as AntdDrawerProps, Drawer } from 'antd'
import { type Dispatch, type JSX, type SetStateAction, useRef, useState } from 'react'

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
  const defaultProps = { open: false, destroyOnHidden: true, ...init }
  const defaultPropsRef = useRef<DrawerProps>(defaultProps)
  defaultPropsRef.current = defaultProps
  const [props, setProps] = useState<DrawerProps>(defaultProps)

  const setDrawerProps: setDrawerProps = useEqualCallback(
    (changes) => {
      setProps((prev) => {
        const changed = typeof changes === 'function' ? changes(prev) : changes

        if (changed.open === false) return { ...defaultPropsRef.current, open: false }

        return { ...prev, ...changed }
      })
    },
    [setProps],
  )

  return {
    drawer: (
      <Drawer
        onClose={() =>
          setProps({
            ...defaultPropsRef.current,
            open: false,
          })
        }
        {...props}
      />
    ),
    drawerProps: props,
    setDrawerProps,
  }
}
