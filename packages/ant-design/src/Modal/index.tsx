import { type ModalProps as AntdModalProps, Modal } from 'antd'
import { type Dispatch, type JSX, type SetStateAction } from 'react'

import { useDialog } from '../utils/use-dialog-props'

export { Modal }

/**
 * Props accepted by the hook-managed modal wrapper.
 */
export interface ModalProps extends AntdModalProps {
  /** Modal body content managed by {@link useModal}. */
  children?: JSX.Element | JSX.Element[] | string
}

/**
 * State setter used to update hook-managed modal props.
 *
 * Each call shallow-merges the provided object, or the object returned by an
 * updater function, into the existing modal props. When `open` is set to
 * `false`, previous modal props are discarded and the modal resets to its
 * initial props.
 */
export type setModalProps = Dispatch<SetStateAction<ModalProps>>

/**
 * Create a hook-managed Ant Design modal instance.
 *
 * The returned setter shallow-merges partial updates into the modal props. When
 * an update sets `open` to `false`, previous modal props are discarded and the
 * modal resets to its initial props.
 *
 * @param {ModalProps} [init] - Initial modal props.
 * @returns Hook-managed modal element, current props, and a state-merging setter.
 *
 * @example
 * ```tsx
 * import { useModal } from '@faasjs/ant-design'
 * import { Button } from 'antd'
 *
 * function Example() {
 *   const { modal, setModalProps } = useModal()
 *
 *   return (
 *     <>
 *       <Button onClick={() => setModalProps({ open: true, title: 'Delete', children: 'Are you sure?' })}>
 *         Open Modal
 *       </Button>
 *       {modal}
 *     </>
 *   )
 * }
 * ```
 */
export function useModal(init?: ModalProps) {
  const [modalProps, setModalProps, closeProps] = useDialog(init, 'onCancel')

  return {
    modal: <Modal {...closeProps} {...modalProps} />,
    modalProps,
    setModalProps,
  }
}
