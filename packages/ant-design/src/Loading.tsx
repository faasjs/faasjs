import { Spin } from 'antd'

/**
 * Props for the {@link Loading} component.
 */
export type LoadingProps = {
  style?: React.CSSProperties
  size?: 'small' | 'default' | 'large'
  loading?: boolean
  children?: React.ReactNode
}

/**
 * Loading component based on Spin
 *
 * @param props - Loading indicator props and optional wrapped children.
 * @param props.style - Inline styles applied to the loading wrapper.
 * @param props.size - Ant Design spinner size.
 * @param props.loading - Whether the spinner should be shown. When `false`, render `children`.
 * @param props.children - Content rendered when `loading` is `false`.
 *
 * @example
 * ```tsx
 * <Loading /> // display loading
 *
 * <Loading loading={ !remoteData }>
 *   <div>{remoteData}</div>
 * </Loading>
 * ```
 */
export function Loading(props: LoadingProps) {
  if (props.loading === false) return <>{props.children}</>

  return (
    <div
      style={{
        ...props.style,
        ...(!props.size || props.size === 'large'
          ? {
              margin: '20vh auto',
              textAlign: 'center',
            }
          : {}),
      }}
    >
      <Spin size={props.size || 'large'} />
    </div>
  )
}
