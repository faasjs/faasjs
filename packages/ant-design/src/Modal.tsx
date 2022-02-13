import { Modal, ModalProps as AntdModalProps } from 'antd'
import { useState } from 'react'

export { Modal }

export type ModalProps = AntdModalProps & {
  children?: JSX.Element | JSX.Element[]
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
 *   return <>{modal}</>
 * }
 * ```
 */
export function useModal (init?: ModalProps) {
  const [props, setProps] = useState<ModalProps>({
    visible: false,
    onCancel: () => setProps(prev => ({
      ...prev,
      visible: false
    })),
    ...init,
  })

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
