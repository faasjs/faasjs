import { Modal as AntdModal, type ModalProps as AntdModalProps } from 'antd'
import { useCallback, useState } from 'react'

export const Modal = AntdModal

// @ts-ignore
Modal.whyDidYouRender = true

export interface ModalProps extends AntdModalProps {
  children?: JSX.Element | JSX.Element[] | string
}

export type setModalProps = (
  changes:
    | Partial<ModalProps>
    | ((prev: Partial<ModalProps>) => Partial<ModalProps>)
) => void

/**
 * Hook style modal
 *
 * ```tsx
 * function Example() {
 *   const { modal, setModalProps } = useModal()
 *
 *   return <>
 *     <Button onClick={() => setModalProps({ open: true })}>Open Modal</Button>
 *     {modal}
 *   </>
 * }
 * ```
 */
export function useModal(init?: ModalProps) {
  const [props, setProps] = useState<ModalProps>({ open: false, ...init })

  const setModalProps: setModalProps = useCallback(
    changes => {
      const changed = typeof changes === 'function' ? changes(props) : changes

      setProps(prev => ({ ...prev, ...changed }))
    },
    [setProps]
  )

  return {
    modal: (
      <Modal
        onCancel={() =>
          setProps(prev => ({
            ...prev,
            open: false,
          }))
        }
        {...props}
      />
    ),
    modalProps: props,
    setModalProps,
  }
}
