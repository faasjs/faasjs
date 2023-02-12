import { App as AntdApp, ConfigProvider } from 'antd'
import type { AppProps as AntdProps } from 'antd/es/app'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import type { StyleProviderProps } from '@ant-design/cssinjs/lib/StyleContext'

export interface AppProps extends AntdProps {
  children: React.ReactNode
  styleProviderProps?: StyleProviderProps
  configProviderProps?: ConfigProviderProps
}

export function App (props: AppProps) {
  return <StyleProvider
    { ...props.styleProviderProps }
  >
    <ConfigProvider { ...Object.assign<StyleProviderProps, StyleProviderProps>(props.configProviderProps, {
      hashPriority: 'high',
      transformers: [legacyLogicalPropertiesTransformer],
    }) }>
      <AntdApp { ...props }>
        { props.children }
      </AntdApp>
    </ConfigProvider>
  </StyleProvider>
}

App.useApp = AntdApp.useApp
