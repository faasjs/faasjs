import type { ReactNode, CSSProperties } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useConfigContext } from './Config'
import { Button, type ButtonProps, Typography } from 'antd'

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

  if (props.href.startsWith('http')) {
    if (props.button)
      return (
        <Button
          {...(props.button || ({} as any))}
          target={props.target || theme.Link?.target || '_blank'}
          style={computedStyle}
          href={props.href}
          onClick={props.onClick}
        >
          {props.text ?? props.children}
        </Button>
      )

    if (props.children)
      return (
        <a
          href={props.href}
          target={props.target || theme.Link?.target}
          style={computedStyle}
          onClick={props.onClick}
        >
          {props.children}
        </a>
      )

    return (
      <Typography.Link
        href={props.href}
        target={props.target || theme.Link?.target || '_blank'}
        style={computedStyle}
        copyable={props.copyable}
        onClick={props.onClick}
      >
        {props.text}
      </Typography.Link>
    )
  }

  if (props.button)
    return (
      <Button
        {...(props.button || ({} as any))}
        style={computedStyle}
        onClick={e =>
          props.onClick
            ? props.onClick(e)
            : (props.target || theme.Link?.target) === '_blank'
              ? window.open(props.href)
              : navigate(props.href)
        }
      >
        {props.text ?? props.children}
      </Button>
    )

  if (props.children)
    return (
      <RouterLink
        to={props.href}
        target={props.target || theme.Link?.target}
        style={computedStyle}
        onClick={props.onClick}
      >
        {props.children}
      </RouterLink>
    )

  return (
    <Typography.Link
      href={props.href}
      target={props.target || theme.Link?.target}
      style={computedStyle}
      copyable={props.copyable}
      onClick={e => {
        if (props.onClick) {
          props.onClick(e)
          return
        }
        if ((props.target || theme.Link?.target) !== '_blank') {
          e.preventDefault()
          navigate(props.href)
        }
      }}
    >
      {props.text}
    </Typography.Link>
  )
}

Link.whyDidYouRender = true
