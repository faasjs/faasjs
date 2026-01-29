import { Button, type ButtonProps, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfigContext } from './Config'

export interface LinkProps {
  href: string
  target?: '_blank'
  text?: string | number
  children?: ReactNode
  style?: CSSProperties
  button?: ButtonProps | boolean
  block?: boolean
  /** only use for text without button */
  copyable?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

/**
 * Link component with button
 *
 * @example
 * ```tsx
 * // pure link
 * <Link href="/">Home</Link>
 *
 * // link with button
 * <Link href="/" button={{ type:'primary' }}>Home</Link>
 * ```
 */
export function Link(props: LinkProps) {
  const { theme } = useConfigContext()
  const navigate = useNavigate()
  const target =
    props.target ||
    theme.Link?.target ||
    (props.href.startsWith('http') ? '_blank' : undefined)

  let computedStyle = {
    ...(theme.Link.style || {}),
    cursor: 'pointer',
    ...props.style,
  }

  if (props.block)
    computedStyle = Object.assign(
      {
        display: 'block',
        width: '100%',
      },
      computedStyle
    )

  if (props.button)
    return (
      <Button
        {...(props.button || ({} as any))}
        style={computedStyle}
        onClick={e => {
          props.onClick
            ? props.onClick(e)
            : target === '_blank'
              ? window.open(props.href)
              : navigate(props.href)
          e.preventDefault()
        }}
      >
        {props.children ?? props.text}
      </Button>
    )

  return (
    <Typography.Link
      href={props.href}
      target={target}
      style={computedStyle}
      copyable={props.copyable}
      onClick={e => {
        e.preventDefault()

        if (props.onClick) {
          props.onClick(e)
          return
        }

        if (target === '_blank') {
          window.open(props.href)
          return
        }

        navigate(props.href)
      }}
    >
      {props.children ?? props.text}
    </Typography.Link>
  )
}
