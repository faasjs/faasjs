import {
  createContext, useContext, CSSProperties
} from 'react'
import { ConfigProviderProps as AntdConfigProviderProps } from 'antd/lib/config-provider'
import { ConfigProvider as AntdConfigProvider } from 'antd'
import { defaultsDeep } from 'lodash'

export type ConfigProviderProps = {
  antd?: AntdConfigProviderProps
  lang?: string
  common?: {
    blank?: string
    all?: string
    submit?: string
    pageNotFound?: string
    add?: string
    delete?: string
    required?: string
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

const common = isZH ? {
  lang: 'zh',
  blank: '空',
  all: '全部',
  submit: '提交',
  pageNotFound: '页面未找到',
  add: '添加',
  delete: '删除',
  required: '必填',
} : {
  lang: 'en',
  blank: 'Empty',
  all: 'All',
  submit: 'Submit',
  pageNotFound: 'Page Not Found',
  add: 'Add',
  delete: 'Delete',
  required: 'is required',
}

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
  return <ConfigContext.Provider value={ defaultsDeep(baseConfig, config) }>
    <AntdConfigProvider { ...config.antd }>
      { children }
    </AntdConfigProvider>
  </ConfigContext.Provider>
}

export function useConfigContext () {
  return useContext(ConfigContext)
}
