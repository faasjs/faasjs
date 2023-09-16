import { Spin } from 'antd'

export type LoadingProps = {
  style?: React.CSSProperties
  size?: 'small' | 'default' | 'large'
  loading?: boolean
  children?: React.ReactNode
}

/**
 * Loading component based on Spin
 *
 * ```tsx
 * <Loading /> // display loading
 *
 * <Loading loading={ !remoteData }>
 *  <div>{remoteData}</div>
 * </Loading>
 * ```
 */
export function Loading(props: LoadingProps) {
  if (props.loading === false) return <>{props.children}</>

  return (
    <div
      style={{
        ...(props.style || {}),
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
