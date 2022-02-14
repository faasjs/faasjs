import { useEffect, useState } from 'react'
import { Typography } from 'antd'
import { useFaasState } from './Config'
import { TitleProps as AntdTitleProps } from 'antd/lib/typography/Title'

export type TitleProps = Omit<AntdTitleProps, 'title'> & {
  title: string | string[]
  /** ` - ` as default */
  separator?: string
  suffix?: string
  render?: boolean
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
  const [computedProps, setComputedProps] = useState<TitleProps>({ title: '' })
  useEffect(() => {
    const title = Array.isArray(props.title) ? props.title : [props.title]

    document.title = title.concat(props.suffix || config.Title.suffix)
      .filter(t => !!t)
      .join(props.separator || config.Title.separator)
    setComputedProps({
      ...props,
      title: undefined
    })
  }, [])

  if (computedProps.render) {
    return <Typography.Title { ...computedProps as AntdTitleProps }>
      {Array.isArray(props.title) ? props.title[0] : props.title}
    </Typography.Title>
  }

  return null
}
