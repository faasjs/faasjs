import { useEffect, useState } from 'react'
import { Typography } from 'antd'
import { useFaasState } from './Config'
import { TitleProps as AntdTitleProps } from 'antd/lib/typography/Title'

export type TitleProps = {
  title: string | string[]
  /** ` - ` as default */
  separator?: string
  suffix?: string

  h1?: boolean | {
    className?: string
    style?: React.CSSProperties
  }
  children?: JSX.Element | null
}

export type CustomTitleProps = AntdTitleProps

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

  if (props.children) return props.children

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


export function CustomTitle (props: CustomTitleProps): JSX.Element {
  const [computedProps, setComputedProps] = useState<CustomTitleProps>()
  useEffect(() => {
    setComputedProps({
      ...props,
      title: undefined,
    })
  }, [])
  if (props.title) {
    return <Title title={ props.title }>
      <Typography.Title { ...computedProps }>
        {props.title}
      </Typography.Title>
    </Title>
  }

  return null
}
