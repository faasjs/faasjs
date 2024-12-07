import { useEqualCallback } from '@faasjs/react'
import { Drawer as AntdDrawer, type DrawerProps as AntdDrawerProps } from 'antd'
import { type Dispatch, type JSX, type SetStateAction, useState } from 'react'

export const Drawer = AntdDrawer as React.FC<DrawerProps> & {
  whyDidYouRender?: boolean
}

Drawer.whyDidYouRender = true

export interface DrawerProps extends AntdDrawerProps {
  children?: JSX.Element | JSX.Element[]
}

export type setDrawerProps = Dispatch<SetStateAction<DrawerProps>>

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

  const setDrawerProps: setDrawerProps = useEqualCallback(
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
