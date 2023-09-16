import { Modal, ModalProps as AntdModalProps } from 'antd'
import { useState } from 'react'

export { Modal }

export interface ModalProps extends AntdModalProps {
  children?: JSX.Element | JSX.Element[] | string
}

export type setModalProps = (changes: Partial<ModalProps>) => void

/**
 * Hook style modal.
 * @param init initial props
 *
 * ```ts
 * function Example() {
 *   const { modal, setModalProps } = useModal()
 *
 *   return <>
 *     <Button onClick={() => setModalProps({ open: true })}>Open Modal</Button>
 *     {modal}</>
 * }
 * ```
 */
export function useModal(init?: ModalProps) {
  const [props, setProps] = useState<ModalProps>({
    open: false,
    onCancel: () =>
      setProps(prev => ({
        ...prev,
        open: false,
      })),
    ...init,
  })

  return {
    modal: <Modal {...props} />,
    modalProps: props,
    setModalProps(changes: Partial<ModalProps>) {
      setProps(prev => ({
        ...prev,
        ...changes,
      }))
    },
  }
}
