import {
  createContext, useContext, CSSProperties, useEffect, useState
} from 'react'
import { defaultsDeep } from 'lodash-es'

export interface ConfigProviderProps {
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

const isZH = /^zh/i.test(navigator.language)

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

const common = isZH ? zh : en

const baseConfig = {
  antd: {},
  lang: 'en',
  common,
  Blank: { text: common.blank },
  Form: { submit: { text: common.submit } },
  Title: {
    separator: ' - ',
    suffix: ''
  },
  Link: { style: {} }
}

export const ConfigContext = createContext<ConfigProviderProps>(baseConfig)

/**
 * Config for @faasjs/ant-design components.
 *
 * ```ts
 * <ConfigProvider config={{
 *   common: {
 *     blank: 'Empty',
 *   },
 * }}>
 *   <Blank />
 * </ConfigProvider>
 * ```
 */
export function ConfigProvider ({
  config,
  children
}: {
  config: ConfigProviderProps
  children: React.ReactNode }) {
  const [values, setValues] = useState<ConfigProviderProps>(baseConfig)

  useEffect(() => {
    console.log(config)
    if (config.lang === 'zh') {
      setValues(defaultsDeep(config, {
        lang: 'zh',
        common: zh,
        Blank: { text: zh.blank },
        Form: { submit: { text: zh.submit } },
      }, baseConfig))
    } else
      setValues(defaultsDeep(config, values))
  }, [])

  return <ConfigContext.Provider value={ values }>
    { children }
  </ConfigContext.Provider>
}

export function useConfigContext () {
  return useContext(ConfigContext)
}
