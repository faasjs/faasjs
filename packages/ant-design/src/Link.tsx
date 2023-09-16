import { type ReactNode, type CSSProperties } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useConfigContext } from './Config'
import { Button, ButtonProps, Typography } from 'antd'

export interface LinkProps {
  href: string
  target?: '_blank'
  text?: string | number
  children?: ReactNode
  style?: CSSProperties
  button?: ButtonProps
  block?: boolean
  /** only use for text without button */
  copyable?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

/**
 * Link component with button.
 *
 * ```ts
 * // pure link
 * <Link href="/">Home</Link>
 *
 * // link with button
 * <Link href="/" button={{ type:'primary' }}>Home</Link>
 * ```
 */
export function Link(props: LinkProps) {
  const { Link: Config } = useConfigContext()
  const navigate = useNavigate()

  let computedStyle = {
    ...(Config.style || {}),
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
          {...props.button}
          target={props.target || Config?.target || '_blank'}
          style={computedStyle}
          href={props.href}
          onClick={props.onClick}
        >
          {props.text ?? props.children}
        </Button>
      )

    if (props.children)
      return (
        // biome-ignore lint/a11y/useValidAnchor: <explanation>
        <a
          href={props.href}
          target={props.target || Config?.target}
          style={computedStyle}
          onClick={props.onClick}
        >
          {props.children}
        </a>
      )

    return (
      <Typography.Link
        href={props.href}
        target={props.target || Config?.target || '_blank'}
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
        {...props.button}
        style={computedStyle}
        onClick={e =>
          props.onClick
            ? props.onClick(e)
            : (props.target || Config?.target) === '_blank'
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
        target={props.target || Config?.target}
        style={computedStyle}
        onClick={props.onClick}
      >
        {props.children}
      </RouterLink>
    )

  return (
    <Typography.Link
      href={props.href}
      target={props.target || Config?.target}
      style={computedStyle}
      copyable={props.copyable}
      onClick={e => {
        if (props.onClick) {
          props.onClick(e)
          return
        }
        if ((props.target || Config?.target) !== '_blank') {
          e.preventDefault()
          navigate(props.href)
        }
      }}
    >
      {props.text}
    </Typography.Link>
  )
}
