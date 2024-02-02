import { Drawer as AntdDrawer, DrawerProps as AntdDrawerProps } from 'antd'
import { useCallback, useState } from 'react'

export const Drawer = AntdDrawer as React.FC<DrawerProps> & {
  whyDidYouRender?: boolean
}

Drawer.whyDidYouRender = true

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
    ...init,
  })

  const setDrawerProps: setDrawerProps = useCallback(
    changes => {
      const changed = typeof changes === 'function' ? changes(props) : changes

      setProps(prev => ({ ...prev, ...changed }))
    },
    [setProps]
  )

  return {
    drawer: (
      <Drawer
        onClose={() =>
          setProps(prev => ({
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
