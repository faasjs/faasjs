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
}

/**
 * ```ts
 * // pure link
 * <Link href="/">Home</Link>
 *
 * // link with button
 * <Link href="/" button={{ type:'primary' }}>Home</Link>
 * ```
 */
export function Link ({
  href, target, text, children, style, button,
}: LinkProps) {
  const { Link } = useConfigContext()

  style = Object.assign({ cursor: 'pointer' }, style)

  if (href.startsWith('http')) {
    if (button)
      return <Button
        { ...button }
        target={ target || Link?.target || '_blank' }
        style={ {
          ...Link.style,
          ...style || {},
        } }
        href={ href }
      >{text ?? children}</Button>

    return <a
      href={ href }
      target={ target || Link?.target || '_blank' }
      style={ {
        ...Link.style,
        ...style || {},
      } }
    >{text ?? children}</a>
  }

  if (button)
    return <RouterLink
      to={ href }
      target={ target || Link?.target }
    >
      <Button
        { ...button }
        style={ {
          ...Link.style,
          ...style || {},
        } }>{text ?? children}</Button>
    </RouterLink>

  return <RouterLink
    to={ href }
    target={ target || Link?.target }
    style={ {
      ...Link.style,
      ...style || {},
    } }
  >{text ?? children}</RouterLink>
}
