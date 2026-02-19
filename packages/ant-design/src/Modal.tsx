import { useEqualCallback } from '@faasjs/react'
import { type ModalProps as AntdModalProps, Modal } from 'antd'
import { type Dispatch, type JSX, type SetStateAction, useState } from 'react'

export { Modal }

export interface ModalProps extends AntdModalProps {
  children?: JSX.Element | JSX.Element[] | string
}

export type setModalProps = Dispatch<SetStateAction<ModalProps>>

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

  const setModalProps: setModalProps = useEqualCallback(
    (changes) => {
      const changed = typeof changes === 'function' ? changes(props) : changes

      setProps((prev) => ({ ...prev, ...changed }))
    },
    [setProps],
  )

  return {
    modal: (
      <Modal
        onCancel={() =>
          setProps((prev) => ({
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
