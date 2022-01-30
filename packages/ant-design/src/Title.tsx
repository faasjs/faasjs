import { useEffect } from 'react'
import { useFaasState } from './Config'

export type TitleProps = {
  title: string | string[]
  /** ` - ` as default */
  separator?: string
  suffix?: string
}

export function Title (props: TitleProps): JSX.Element {
  const [config] = useFaasState()

  useEffect(() => {
    const title = Array.isArray(props.title) ? props.title : [props.title]

    document.title = title.concat(props.suffix || config.Title.suffix)
      .filter(t => !!t)
      .join(props.separator || config.Title.separator)
  }, [])

  return null
}
