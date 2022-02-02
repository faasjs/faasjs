import { useEffect } from 'react'
import { createGlobalState } from 'react-use'

export type FaasState = {
  common: {
    blank: string
    all: string
    submit: string
    pageNotFound: string
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

const isCN = /^zh/i.test(navigator.language)

const common = isCN ? {
  blank: '空',
  all: '全部',
  submit: '提交',
  pageNotFound: '页面未找到',
} : {
  blank: 'Empty',
  all: 'All',
  submit: 'Submit',
  pageNotFound: 'Page Not Found',
}

export const useFaasState = createGlobalState<FaasState>({
  common,
  Blank: { text: common.blank },
  Form: { submit: { text: common.submit } },
  Title: {
    separator: ' - ',
    suffix: ''
  },
})

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
