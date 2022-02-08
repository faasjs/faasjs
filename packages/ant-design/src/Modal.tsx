import { Modal, ModalProps as AntdModalProps } from 'antd'
import { useState } from 'react'

export { Modal }

export type ModalProps = AntdModalProps & {
  children?: JSX.Element | JSX.Element[]
}

/**
 * Hook style modal.
 * @param init initial props
 *
 * ```ts
 * function Example() {
 *   const { modal, setModalProps } = useModal()
 *
 *   return <>{modal}</>
 * }
 * ```
 */
export function useModal (init?: ModalProps) {
  const [props, setProps] = useState<ModalProps>(init)

  return {
    modal: <Modal { ...props } />,
    modalProps: props,
    setModalProps (changes: Partial<ModalProps>) {
      setProps(prev => ({
        ...prev,
        ...changes
      }))
    }
  }
}
