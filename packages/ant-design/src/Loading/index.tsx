import { Spin } from 'antd'

/**
 * Props for the {@link Loading} component.
 */
export type LoadingProps = {
  /** Inline styles applied to the loading wrapper. */
  style?: React.CSSProperties
  /** Whether the loading wrapper should fill the surrounding flex container. */
  full?: boolean
  /**
   * Ant Design spinner size.
   *
   * @default 'large'
   */
  size?: 'small' | 'default' | 'large'
  /**
   * Whether the loading indicator should be shown.
   *
   * @default true
   */
  loading?: boolean
  /** Content rendered when `loading` is `false`. */
  children?: React.ReactNode
}

/**
 * Render an Ant Design loading spinner with an optional content fallback.
 *
 * @param {LoadingProps} props - Loading indicator props and optional wrapped children.
 *
 * @example
 * ```tsx
 * import { Loading } from '@faasjs/ant-design'
 *
 * export function Page({ remoteData }: { remoteData?: string }) {
 *   return (
 *     <>
 *       <Loading />
 *       <Loading loading={!remoteData}>
 *         <div>{remoteData}</div>
 *       </Loading>
 *     </>
 *   )
 * }
 * ```
 */
export function Loading(props: LoadingProps) {
  if (props.loading === false) return <>{props.children}</>

  return (
    <div
      style={{
        ...(props.full
          ? {
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }
          : {}),
        ...props.style,
      }}
    >
      <Spin size={props.size || 'large'} />
    </div>
  )
}
