import type { ReactNode, CSSProperties } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useConfigContext } from './Config'
import { Button, ButtonProps } from 'antd'

export interface LinkProps {
  href: string
  target?: string
  text?: string | number
  children?: ReactNode
  style?: CSSProperties
  button?:ButtonProps
  block?: boolean
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
export function Link (props: LinkProps) {
  const { Link } = useConfigContext()

  props.style = Object.assign({ cursor: 'pointer' }, props.style)

  if (props.block)
    props.style = Object.assign({
      display: 'block',
      width: '100%',
    }, props.style)

  if (props.href.startsWith('http')) {
    if (props.button)
      return <Button
        { ...props.button }
        target={ props.target || Link?.target || '_blank' }
        style={ {
          ...Link.style,
          ...props.style || {},
        } }
        href={ props.href }
      >{props.text ?? props.children}</Button>

    return <a
      href={ props.href }
      target={ props.target || Link?.target || '_blank' }
      style={ {
        ...Link.style,
        ...props.style || {},
      } }
    >{props.text ?? props.children}</a>
  }

  if (props.button)
    return <RouterLink
      to={ props.href }
      target={ props.target || Link?.target }
    >
      <Button
        { ...props.button }
        style={ {
          ...Link.style,
          ...props.style || {},
        } }>{props.text ?? props.children}</Button>
    </RouterLink>

  return <RouterLink
    to={ props.href }
    target={ props.target || Link?.target }
    style={ {
      ...Link.style,
      ...props.style || {},
    } }
  >{props.text ?? props.children}</RouterLink>
}
