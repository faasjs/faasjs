import type { ReactNode, CSSProperties } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useConfigContext } from './Config'
import { Button, ButtonProps } from 'antd'

export function Link ({
  href, target, text, children, style, button,
}: {
  href: string
  target?: string
  text?: string | number
  children?: ReactNode
  style?: CSSProperties
  button?:ButtonProps
}) {
  const { Link } = useConfigContext()

  style = Object.assign({ cursor: 'pointer' }, style)

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
