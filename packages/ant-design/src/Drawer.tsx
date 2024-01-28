import { Drawer as AntdDrawer, DrawerProps as AntdDrawerProps } from 'antd'
import { useState } from 'react'

export const Drawer = AntdDrawer as React.FC<DrawerProps>

export interface DrawerProps extends AntdDrawerProps {
  children?: JSX.Element | JSX.Element[]
}

export type setDrawerProps = (
  changes:
    | Partial<DrawerProps>
    | ((prev: Partial<DrawerProps>) => Partial<DrawerProps>)
) => void

/**
 * Hook style drawer
 *
 * ```tsx
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
    setDrawerProps(changes: Parameters<setDrawerProps>[0]) {
      if (typeof changes === 'function') {
        setProps(prev => ({
          ...prev,
          ...changes(props),
        }))
        return
      }

      setProps(prev => ({
        ...prev,
        ...changes,
      }))
    },
  }
}

Drawer.whyDidYouRender = true
