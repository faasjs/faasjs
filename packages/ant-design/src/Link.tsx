import { Button, type ButtonProps, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { useConfigContext } from './Config'

/**
 * Props for the navigation-aware {@link Link} component.
 */
export interface LinkProps {
  /** Target URL or route path. */
  href: string
  /** Explicit link target. Absolute HTTP URLs default to `_blank`. */
  target?: '_blank'
  /** Text rendered when `children` is not provided. */
  text?: string | number
  /** Custom link content rendered instead of `text`. */
  children?: ReactNode
  /** Inline styles merged with the theme defaults. */
  style?: CSSProperties
  /** Button mode config, or `true` to render with default Ant Design button props. */
  button?: ButtonProps | boolean
  /** Whether the rendered link or button should take the full width. */
  block?: boolean
  /** Whether plain-text links should enable the Typography copy action. */
  copyable?: boolean
  /** Custom click handler that overrides the built-in navigation behavior. */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

/**
 * Render a navigation-aware link or button.
 *
 * Internal links are pushed through React Router, while links with `_blank` targets are opened
 * with `window.open`.
 *
 * @param {LinkProps} props - Link props controlling navigation target, rendering mode, and button behavior.
 *
 * @example
 * ```tsx
 * import { Link } from '@faasjs/ant-design'
 *
 * export function Navigation() {
 *   return (
 *     <>
 *       <Link href="/">Home</Link>
 *       <Link href="/users/new" button={{ type: 'primary' }}>
 *         Create User
 *       </Link>
 *     </>
 *   )
 * }
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
