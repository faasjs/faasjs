import { useEffect } from 'react'
import { createGlobalState } from 'react-use'

export type FaasState = {
  common: {
    blank: string
    all: string
    submit: string
  }
  Blank: {
    text: string
  }
  Form: {
    submit: {
      text: string
    }
  }
}

const common = {
  blank: navigator.language?.includes('CN') ? '空' : 'Empty',
  all: navigator.language?.includes('CN') ? '全部' : 'All',
  submit: navigator.language?.includes('CN') ? '提交' : 'Submit',
}

export const useFaasState = createGlobalState<FaasState>({
  common,
  Blank: { text: common.blank },
  Form: { submit: { text: common.submit } },
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
