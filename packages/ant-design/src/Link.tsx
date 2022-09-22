import type { ReactNode, CSSProperties } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useConfigContext } from './Config'
import { Button, ButtonProps } from 'antd'

export type LinkProps = {
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
 * <Link href="/" button={{type:'primary'}}>Home</Link>
 * ```
 */
export function Link ({
  href, target, text, children, style, button,
}: LinkProps) {
  const { Link } = useConfigContext()

  style = Object.assign({ cursor: 'pointer' }, style)

  if (href.startsWith('http') || href.startsWith('mailto')) {
    if (button)
      return <Button { ...button }>
        <a
          href={ href }
          target={ target || Link?.target }
          style={ {
            ...Link.style,
            ...style || {},
          } }
        >{text || children}</a>
      </Button>

    return <a
      href={ href }
      target={ target || Link?.target }
      style={ {
        ...Link.style,
        ...style || {},
      } }
    >{text || children}</a>
  }

  if (button)
    return <Button { ...button }>
      <RouterLink
        to={ href }
        target={ target || Link?.target }
        style={ {
          ...Link.style,
          ...style || {},
        } }
      >{text || children}</RouterLink>
    </Button>

  return <RouterLink
    to={ href }
    target={ target || Link?.target }
    style={ {
      ...Link.style,
      ...style || {},
    } }
  >{text || children}</RouterLink>
}
