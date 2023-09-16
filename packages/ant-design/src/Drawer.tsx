import { Drawer, DrawerProps as AntdDrawerProps } from 'antd'
import { useState } from 'react'

export { Drawer }

export interface DrawerProps extends AntdDrawerProps {
  children?: JSX.Element | JSX.Element[]
}

export type setDrawerProps = (changes: Partial<DrawerProps>) => void

/**
 * Hook style drawer.
 *
 * @param init initial props
 *
 * ```ts
 * function Example() {
 *   const { drawer, setDrawerProps } = useDrawer()
 *
 *   return <>
 *     <Button onClick={ () => setDrawerProps(prev => ({ open: !prev.open})) }>
 *       Toggle
 *     </Button>
 *     {drawer}
 *   </>
 * }
 * ```
 */
export function useDrawer(init?: DrawerProps) {
  const [props, setProps] = useState<DrawerProps>({
    open: false,
    onClose: () =>
      setProps(prev => ({
        ...prev,
        open: false,
      })),
    ...init,
  })

  return {
    drawer: <Drawer {...props} />,
    drawerProps: props,
    setDrawerProps(changes: Partial<DrawerProps>) {
      setProps(prev => ({
        ...prev,
        ...changes,
      }))
    },
  }
}
