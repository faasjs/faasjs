import { useEqualCallback } from '@faasjs/react'
import { type DrawerProps as AntdDrawerProps, Drawer } from 'antd'
import { type Dispatch, type JSX, type SetStateAction, useState } from 'react'

export { Drawer }

/**
 * Props accepted by the hook-managed drawer wrapper.
 */
export interface DrawerProps extends AntdDrawerProps {
  children?: JSX.Element | JSX.Element[]
}

/**
 * State setter used to update hook-managed drawer props.
 */
export type setDrawerProps = Dispatch<SetStateAction<DrawerProps>>

/**
 * Hook style drawer
 *
 * @param init - Initial drawer props.
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
