import { useEffect } from 'react'
import { useFaasState } from './Config'

export type TitleProps = {
  title: string | string[]
  /** ` - ` as default */
  separator?: string
  suffix?: string

  h1?: boolean | {
    className?: string
    style?: React.CSSProperties
  }
}

/**
 * Title is used to change the title of the page.
 *
 * ```ts
 * <Title title='hi' /> // => return null, change the document.title to 'hi'
 * <Title title={['a', 'b']} /> // => return null, change the document.title to 'a - b'
 *
 * <Title title='hi' h1 /> // => return <h1>hi</h1>, change the document.title to 'hi'
 * <Title title={['a', 'b']} h1 /> // => return <h1>a</h1>, change the document.title to 'a - b'
 * ```
 */
export function Title (props: TitleProps): JSX.Element {
  const [config] = useFaasState()

  useEffect(() => {
    const title = Array.isArray(props.title) ? props.title : [props.title]

    document.title = title.concat(props.suffix || config.Title.suffix)
      .filter(t => !!t)
      .join(props.separator || config.Title.separator)
  }, [])

  if (props.h1) {
    if (typeof props.h1 === 'boolean')
      return <h1>{Array.isArray(props.title) ? props.title[0] : props.title}</h1>

    return <h1
      className={ props.h1.className }
      style={ props.h1.style }
    >{Array.isArray(props.title) ? props.title[0] : props.title}</h1>
  }

  return null
}
