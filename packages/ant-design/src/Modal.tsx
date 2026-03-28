import { useEqualCallback } from '@faasjs/react'
import { type ModalProps as AntdModalProps, Modal } from 'antd'
import { type Dispatch, type JSX, type SetStateAction, useState } from 'react'

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
 */
export type setModalProps = Dispatch<SetStateAction<ModalProps>>

/**
 * Create a hook-managed Ant Design modal instance.
 *
 * The returned setter merges partial updates into the current modal props instead of replacing the
 * entire state object.
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
