import { App as AntdApp } from 'antd'
import type { AppProps as AntdProps } from 'antd/es/app'

export interface AppProps extends AntdProps {
  children: React.ReactNode
}

export function App (props: AppProps) {
  return <AntdApp { ...props }>
    { props.children }
  </AntdApp>
}

App.useApp = AntdApp.useApp
