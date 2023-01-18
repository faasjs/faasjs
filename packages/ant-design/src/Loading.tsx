import { Spin } from 'antd'

/**
 * Loading component based on Spin
 */
export function Loading (props: {
  style?: React.CSSProperties
  size?: 'small' | 'default' | 'large'
}) {
  return <div style={ {
    ...props.style || {},
    ...(!props.size || props.size === 'large' ? {
      margin: '20vh auto',
      textAlign: 'center',
    } : {}),
  } }>
    <Spin size={ props.size || 'large' } />
  </div>
}
