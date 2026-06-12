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
 *
 * Each call shallow-merges the provided object, or the object returned by an
 * updater function, into the existing modal props. Omitted keys are preserved;
 * set a key to `undefined` or a new value when you need to clear or replace it.
 */
export type setModalProps = Dispatch<SetStateAction<ModalProps>>

/**
 * Create a hook-managed Ant Design modal instance.
 *
 * The returned setter shallow-merges partial updates into the modal props instead
 * of replacing the entire state object. The updater form is also merged after it
 * returns, so omitted keys stay unchanged.
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
  const [props, setProps] = useState<ModalProps>({ open: false, destroyOnHidden: true, ...init })

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
