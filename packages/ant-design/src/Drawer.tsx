import { Drawer, DrawerProps as AntdDrawerProps } from 'antd'
import { useState } from 'react'

export { Drawer }

export type DrawerProps = AntdDrawerProps & {
  children?: JSX.Element | JSX.Element[]
}

export type setDrawerProps = (changes: Partial<DrawerProps>) => void

/**
 * Hook style drawer.
 * @param init initial props
 *
 * ```ts
 * function Example() {
 *   const { drawer, setDrawerProps } = useDrawer()
 *
 *   return <>
 *     <Button onClick={ () => setDrawerProps(prev => ({ visible: !prev.visible})) }>
 *       Toggle
 *     </Button>
 *     {drawer}
 *   </>
 * }
 * ```
 */
export function useDrawer (init?: DrawerProps) {
  const [props, setProps] = useState<DrawerProps>({
    visible: false,
    onClose: () => setProps(prev => ({
      ...prev,
      visible: false
    })),
    ...init,
  })

  return {
    drawer: <Drawer { ...props } />,
    drawerProps: props,
    setDrawerProps (changes: Partial<DrawerProps>) {
      setProps(prev => ({
        ...prev,
        ...changes
      }))
    }
  }
}
