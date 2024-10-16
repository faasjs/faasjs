import { createContext, useContext, type CSSProperties, useState } from 'react'
import { defaultsDeep } from 'lodash-es'
import {
  FaasReactClient,
  useEqualEffect,
  type FaasReactClientOptions,
} from '@faasjs/react'

export interface ConfigProviderProps {
  faasClientOptions?: FaasReactClientOptions
  children: React.ReactNode
  theme?: {
    lang?: string
    common?: {
      blank?: string
      all?: string
      submit?: string
      pageNotFound?: string
      add?: string
      delete?: string
      required?: string
      search?: string
      reset?: string
    }
    Blank?: {
      text?: string
    }
    Form?: {
      submit?: {
        text?: string
      }
    }
    Title?: {
      /** ' - ' as default */
      separator?: string
      suffix?: string
    }
    Link?: {
      /** '_blank' as default */
      target?: string
      style?: CSSProperties
    }
  }
}

const zh = {
  lang: 'zh',
  blank: '空',
  all: '全部',
  submit: '提交',
  pageNotFound: '页面未找到',
  add: '添加',
  delete: '删除',
  required: '必填',
  search: '搜索',
  reset: '重置',
}

const en = {
  lang: 'en',
  blank: 'Empty',
  all: 'All',
  submit: 'Submit',
  pageNotFound: 'Page Not Found',
  add: 'Add',
  delete: 'Delete',
  required: 'is required',
  search: 'Search',
  reset: 'Reset',
}

const baseTheme = {
  lang: 'en',
  common: en,
  Blank: { text: en.blank },
  Form: { submit: { text: en.submit } },
  Title: {
    separator: ' - ',
    suffix: '',
  },
  Link: { style: {} },
}

export const ConfigContext = createContext<Partial<ConfigProviderProps>>({
  theme: baseTheme,
})

/**
 * Config for `@faasjs/ant-design` components.
 *
 * @example
 * ```tsx
 * import { ConfigProvider } from '@faasjs/ant-design'
 *
 * <ConfigProvider theme={{ common: { blank: 'Empty' } }}>
 *   <Blank />
 * </ConfigProvider>
 * ```
 */
export function ConfigProvider(props: ConfigProviderProps) {
  const [theme, setTheme] = useState<ConfigProviderProps['theme']>(baseTheme)

  useEqualEffect(() => {
    const lang = props.theme?.lang || (!props.theme?.lang && /^zh/i.test(navigator.language) ? 'zh' : 'en')
    if (lang === 'zh') {
      setTheme(
        defaultsDeep(
          props.theme,
          {
            lang: 'zh',
            common: zh,
            Blank: { text: zh.blank },
            Form: { submit: { text: zh.submit } },
          },
          baseTheme
        )
      )
    } else setTheme(defaultsDeep(props.theme, baseTheme))

    if (props.faasClientOptions) FaasReactClient(props.faasClientOptions)
  }, [props.theme])

  if (!theme) return null

  return (
    <ConfigContext.Provider value={{ theme }}>
      {props.children}
    </ConfigContext.Provider>
  )
}

export function useConfigContext() {
  return useContext(ConfigContext)
}
