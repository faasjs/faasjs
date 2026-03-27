import { useEqualCallback } from '@faasjs/react'
import { type ModalProps as AntdModalProps, Modal } from 'antd'
import { type Dispatch, type JSX, type SetStateAction, useState } from 'react'

export { Modal }

/**
 * Props accepted by the hook-managed modal wrapper.
 */
export interface ModalProps extends AntdModalProps {
  children?: JSX.Element | JSX.Element[] | string
}

/**
 * State setter used to update hook-managed modal props.
 */
export type setModalProps = Dispatch<SetStateAction<ModalProps>>

/**
 * Hook style modal
 *
 * @param init - Initial modal props.
 *
 * Common initial props include `open`, `title`, and `children`.
 * Other Ant Design `ModalProps` fields are forwarded to the managed modal instance.
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
