import { describeDialogHook } from '../../__tests__/dialog-hook-cases'
import { type DrawerProps, useDrawer } from '../../Drawer'

describeDialogHook<DrawerProps, ReturnType<typeof useDrawer>>({
  children: <div>content</div>,
  clearedPropNames: ['children', 'className', 'title'],
  getElement: (result) => result.drawer,
  getProps: (result) => result.drawerProps,
  getSetProps: (result) => result.setDrawerProps,
  name: 'Drawer',
  preservedProps: {
    className: 'custom-drawer',
  },
  useHook: useDrawer,
})
