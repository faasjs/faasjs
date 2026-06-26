import { useEqualCallback } from '@faasjs/react'
import { type Dispatch, type SetStateAction, useRef, useState } from 'react'

type DialogProps = {
  destroyOnHidden?: boolean
  onCancel?: (...args: any[]) => void
  onClose?: (...args: any[]) => void
  open?: boolean
}

type DialogClosePropName = 'onCancel' | 'onClose'

export function useDialogProps<TProps extends DialogProps>(init?: TProps) {
  const defaultProps = { open: false, destroyOnHidden: true, ...init } as TProps
  const defaultPropsRef = useRef<TProps>(defaultProps)
  defaultPropsRef.current = defaultProps
  const [props, setProps] = useState<TProps>(defaultProps)

  const setDialogProps: Dispatch<SetStateAction<TProps>> = useEqualCallback(
    (changes) => {
      setProps((prev) => {
        const changed = typeof changes === 'function' ? changes(prev) : changes

        if (changed.open === false) return { ...defaultPropsRef.current, open: false } as TProps

        return { ...prev, ...changed }
      })
    },
    [setProps],
  )

  return [props, setDialogProps] as const
}

export function useDialog<TProps extends DialogProps>(
  init: TProps | undefined,
  closePropName: 'onCancel',
): readonly [TProps, Dispatch<SetStateAction<TProps>>, { onCancel: () => void }]
export function useDialog<TProps extends DialogProps>(
  init: TProps | undefined,
  closePropName: 'onClose',
): readonly [TProps, Dispatch<SetStateAction<TProps>>, { onClose: () => void }]
export function useDialog<TProps extends DialogProps>(
  init: TProps | undefined,
  closePropName: DialogClosePropName,
) {
  const [props, setDialogProps] = useDialogProps(init)

  return [
    props,
    setDialogProps,
    {
      [closePropName]: () => setDialogProps({ open: false } as TProps),
    },
  ] as const
}
