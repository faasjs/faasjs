import { createContext, useContext } from 'react'

export type FaasState = {
  lang: string
  common: {
    blank: string
    all: string
    submit: string
    pageNotFound: string
    add: string
    delete: string
    required: string
  }
  Blank: {
    text: string
  }
  Form: {
    submit: {
      text: string
    }
  }
  Title: {
    separator: string
    suffix: string
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
  lang: 'en',
  common,
  Blank: { text: common.blank },
  Form: { submit: { text: common.submit } },
  Title: {
    separator: ' - ',
    suffix: ''
  },
}

export const ConfigContext = createContext<FaasState>(baseConfig)

/**
 * Config for @faasjs/ant-design components.
 * @param props {object}
 * @param props.config {Partial<FaasState>}
 * @returns {null}
 *
 * ```ts
 * <ConfigProvider config={{
 *  common: {
 *   blank: '空',
 *  },
 * }}>
 *  <Blank />
 * </ConfigProvider>
 * ```
 */
export function ConfigProvider ({
  config,
  children
}: {
  config: Partial<FaasState>
  children: React.ReactNode }) {
  return <ConfigContext.Provider value={ {
    ...baseConfig,
    ...config
  } }>
    {children}
  </ConfigContext.Provider>
}

export function useConfigContext () {
  return useContext(ConfigContext)
}
