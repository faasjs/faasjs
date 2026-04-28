import { useEqualEffect } from '@faasjs/react'
import { cloneElement, type JSX } from 'react'

import { useConfigContext } from '../Config'

/**
 * Props for the document-title helper component.
 */
export interface TitleProps {
  /** Title text or title segments used to update `document.title`. */
  title: string | string[]
  /**
   * Separator used when joining title segments.
   *
   * @default ' - '
   */
  separator?: string
  /** Suffix appended to the generated document title. */
  suffix?: string

  /** Whether to render an `h1`, or the props used to style that `h1`. */
  h1?:
    | boolean
    | {
        className?: string
        style?: React.CSSProperties
      }

  /** Whether to render plain text instead of returning `null`. */
  plain?: boolean

  /** Existing element cloned with a `title` prop. */
  children?: JSX.Element
}

/**
 * Update `document.title` and optionally render the title inline.
 *
 * The component returns `null` by default and is often used only for its side effect.
 *
 * @param {TitleProps} props - Title props controlling document title updates and optional inline rendering.
 *
 * @example
 * ```tsx
 * import { Title } from '@faasjs/ant-design'
 *
 * export function DetailPage() {
 *   return (
 *     <>
 *       <Title title={['Orders', 'Detail']} h1 />
 *       <div>...</div>
 *     </>
 *   )
 * }
 * ```
 */
export function Title(props: TitleProps): JSX.Element | null {
  const { theme } = useConfigContext()

  useEqualEffect(() => {
    const title = Array.isArray(props.title) ? props.title : [props.title]

    document.title = title
      .concat(props.suffix || theme.Title.suffix)
      .filter((t) => !!t)
      .join(props.separator || theme.Title.separator)
  }, [props, theme.Title])

  if (props.h1) {
    if (typeof props.h1 === 'boolean')
      return <h1>{Array.isArray(props.title) ? props.title[0] : props.title}</h1>

    return (
      <h1 className={props.h1.className} style={props.h1.style}>
        {Array.isArray(props.title) ? props.title[0] : props.title}
      </h1>
    )
  }

  if (props.plain) return <>{Array.isArray(props.title) ? props.title[0] : props.title}</>

  if (props.children) return cloneElement(props.children, { title: props.title })

  return null
}
