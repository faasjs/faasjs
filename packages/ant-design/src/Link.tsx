import { Button, type ButtonProps, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { useConfigContext } from './Config'

/**
 * Props for the navigation-aware {@link Link} component.
 */
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
 * @param props - Link props controlling navigation target, rendering mode, and button behavior.
 * @param props.href - Target URL or route path.
 * @param props.target - Link target. Defaults to `_blank` for absolute HTTP URLs.
 * @param props.text - Displayed link text when `children` is not provided.
 * @param props.children - Displayed link content rendered instead of `text` when present.
 * @param props.style - Inline styles merged with theme defaults.
 * @param props.button - Button mode config, or `true` to render with default Ant Design button props.
 * @param props.block - Whether the rendered link or button should take the full width.
 * @param props.copyable - Whether plain-text links should enable the Typography copy action.
 * @param props.onClick - Custom click handler that overrides built-in navigation.
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
    props.target || theme.Link?.target || (props.href.startsWith('http') ? '_blank' : undefined)

  let computedStyle = {
    ...theme.Link.style,
    cursor: 'pointer',
    ...props.style,
  }

  if (props.block)
    computedStyle = Object.assign(
      {
        display: 'block',
        width: '100%',
      },
      computedStyle,
    )

  const buttonProps = props.button && typeof props.button === 'object' ? props.button : undefined
  const copyableProps = typeof props.copyable === 'undefined' ? {} : { copyable: props.copyable }

  if (props.button)
    return (
      <Button
        {...buttonProps}
        style={computedStyle}
        onClick={(e) => {
          e.preventDefault()

          if (props.onClick) {
            props.onClick(e)
            return
          }

          if (target === '_blank') {
            window.open(props.href)
            return
          }

          void navigate(props.href)
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
      {...copyableProps}
      onClick={(e) => {
        e.preventDefault()

        if (props.onClick) {
          props.onClick(e)
          return
        }

        if (target === '_blank') {
          window.open(props.href)
          return
        }

        void navigate(props.href)
      }}
    >
      {props.children ?? props.text}
    </Typography.Link>
  )
}
