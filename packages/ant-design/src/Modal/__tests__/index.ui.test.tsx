import { describeDialogHook } from '../../__tests__/dialog-hook-cases'
import { type ModalProps, useModal } from '../../Modal'

describeDialogHook<ModalProps, ReturnType<typeof useModal>>({
  children: 'content',
  clearedPropNames: ['children', 'confirmLoading', 'title'],
  closePropName: 'onCancel',
  getElement: (result) => result.modal,
  getProps: (result) => result.modalProps,
  getSetProps: (result) => result.setModalProps,
  name: 'Modal',
  preservedProps: {
    confirmLoading: true,
  },
  useHook: useModal,
})
