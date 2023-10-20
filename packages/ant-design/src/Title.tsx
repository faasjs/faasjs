import { useEffect, cloneElement } from 'react'
import { useConfigContext } from './Config'

export interface TitleProps {
  title: string | string[]
  /** ` - ` as default */
  separator?: string
  suffix?: string

  /** return a h1 element */
  h1?:
    | boolean
    | {
        className?: string
        style?: React.CSSProperties
      }

  /** return a pure text element */
  plain?: boolean

  /** return children */
  children?: JSX.Element
}

/**
 * Title is used to change the title of the page.
 * Return null by default.
 *
 * ```ts
 * // return null
 * <Title title='hi' /> // => change the document.title to 'hi'
 * <Title title={['a', 'b']} /> // => change the document.title to 'a - b'
 *
 * // return h1
 * <Title title='hi' h1 /> // => <h1>hi</h1>
 * <Title title={['a', 'b']} h1 /> // => <h1>a</h1>
 *
 * // return children
 * <Title title='hi'><CustomTitle /></Title> // => <CustomTitle />
 * ```
 */
export function Title(props: TitleProps): JSX.Element {
  const { Title } = useConfigContext()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const title = Array.isArray(props.title) ? props.title : [props.title]

    document.title = title
      .concat(props.suffix || Title.suffix)
      .filter(t => !!t)
      .join(props.separator || Title.separator)
  }, [props])

  if (props.h1) {
    if (typeof props.h1 === 'boolean')
      return (
        <h1>{Array.isArray(props.title) ? props.title[0] : props.title}</h1>
      )

    return (
      <h1 className={props.h1.className} style={props.h1.style}>
        {Array.isArray(props.title) ? props.title[0] : props.title}
      </h1>
    )
  }

  if (props.plain)
    return <>{Array.isArray(props.title) ? props.title[0] : props.title}</>

  if (props.children)
    return cloneElement(props.children, { title: props.title })

  return null
}
