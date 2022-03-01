import { useEffect } from 'react'
import { createGlobalState } from 'react-use'

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

export const useFaasState = createGlobalState<FaasState>({
  lang: 'en',
  common,
  Blank: { text: common.blank },
  Form: { submit: { text: common.submit } },
  Title: {
    separator: ' - ',
    suffix: ''
  },
})

/**
 * Config for all @faasjs/ant-design components.
 * @param props {object}
 * @param props.config {Partial<FaasState>}
 * @returns {null}
 *
 * ```ts
 * <Config config={{
 *  common: {
 *   blank: '空',
 *  },
 * }} />
 * ```
 */
export function Config (props: { config: Partial<FaasState> }): JSX.Element {
  const [_, setState] = useFaasState()

  useEffect(() => {
    setState(prev => ({
      ...prev,
      ...props.config
    }))
  }, [])

  return null
}
