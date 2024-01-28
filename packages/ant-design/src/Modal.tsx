import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd'
import { useCallback, useMemo, useState } from 'react'

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

  const onCancel = useCallback(() => {
    setProps(prev => ({
      ...prev,
      open: false,
    }))
  }, [])

  const modal = useMemo(() => <Modal onCancel={onCancel} {...props} />, [props])

  const setModalProps = useCallback<setModalProps>(changes => {
    if (typeof changes === 'function') {
      setProps(prev => ({
        ...prev,
        ...changes(props),
      }))
      return
    }

    setProps(prev => ({
      ...prev,
      ...changes,
    }))
  }, [])

  return {
    modal,
    modalProps: props,
    setModalProps,
  }
}
