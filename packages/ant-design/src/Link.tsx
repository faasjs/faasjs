import type { ReactNode, CSSProperties } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useConfigContext } from './Config'

export function Link ({
  href, target, text, children, style
}: {
  href: string
  target?: string
  text?: string | number
  children?: ReactNode
  style?: CSSProperties
}) {
  const { Link } = useConfigContext()

  style = Object.assign({ cursor: 'pointer' }, style)

  return <RouterLink
    to={ href }
    target={ target || Link?.target }
    style={ {
      ...Link.style,
      ...style || {},
    } }
  >{text || children}</RouterLink>
}
