import { useEqualEffect } from '@faasjs/react'
import { defaultsDeep } from 'lodash-es'
import { type CSSProperties, createContext, useContext, useState } from 'react'

import { FaasReactClient, type FaasReactClientOptions } from './FaasDataWrapper'

/**
 * Fully resolved theme object consumed by `@faasjs/ant-design` components.
 */
export type ResolvedTheme = {
  /** Current language code used for built-in copy. */
  lang: string
  /** Shared copy used by multiple components. */
  common: {
    blank: string
    all: string
    submit: string
    pageNotFound: string
    add: string
    delete: string
    required: string
    search: string
    reset: string
  }
  /** Theme values consumed by the `Blank` component. */
  Blank: {
    text: string
  }
  /** Theme values consumed by the `Form` component. */
  Form: {
    submit: {
      text: string
    }
  }
  /** Theme values consumed by the `Title` component. */
  Title: {
    separator: string
    suffix: string
  }
  /** Theme values consumed by the `Link` component. */
  Link: {
    target?: string
    style: CSSProperties
  }
}

type ConfigContextValue = {
  theme: ResolvedTheme
}

/**
 * Props for the `@faasjs/ant-design` {@link ConfigProvider}.
 */
export interface ConfigProviderProps {
  /** Optional FaasJS client options used to initialize {@link FaasReactClient}. */
  faasClientOptions?: FaasReactClientOptions
  /** Descendant components that consume the resolved config context. */
  children: React.ReactNode
  /** Theme overrides merged with the built-in defaults. */
  theme?: {
    /** Language code used to select localized defaults. */
    lang?: string
    /** Common shared copy and labels used across components. */
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
    /** Blank-component theme overrides. */
    Blank?: {
      text?: string
    }
    /** Form-component theme overrides. */
    Form?: {
      submit?: {
        text?: string
      }
    }
    /** Title-component theme overrides. */
    Title?: {
      /**
       * Separator inserted between title segments.
       *
       * @default ' - '
       */
      separator?: string
      /** Suffix appended to generated page titles. */
      suffix?: string
    }
    /** Link-component theme overrides. */
    Link?: {
      /**
       * Default target used by the `Link` component when `props.target` is omitted.
       *
       * @default '_blank'
       */
      target?: string
      /** Default inline styles merged into every `Link`. */
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

const baseTheme: ResolvedTheme = {
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

/**
 * React context storing the resolved FaasJS Ant Design theme.
 */
export const ConfigContext = createContext<ConfigContextValue>({
  theme: baseTheme,
})

/**
 * Provide theme overrides and optional FaasJS client initialization for descendants.
 *
 * Theme overrides are merged with the built-in defaults. When `theme.lang` is omitted, the
 * provider infers a default language from `navigator.language`.
 *
 * @param {ConfigProviderProps} props - Theme overrides and optional FaasJS client configuration.
 *
 * @example
 * ```tsx
 * import { Blank, ConfigProvider } from '@faasjs/ant-design'
 *
 * export function Page() {
 *   return (
 *     <ConfigProvider theme={{ common: { blank: 'Empty' } }}>
 *       <Blank />
 *     </ConfigProvider>
 *   )
 * }
 * ```
 */
export function ConfigProvider(props: ConfigProviderProps) {
  const [theme, setTheme] = useState<ResolvedTheme>()

  useEqualEffect(() => {
    const lang =
      props.theme?.lang || (!props.theme?.lang && /^zh/i.test(navigator.language) ? 'zh' : 'en')
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
          baseTheme,
        ) as ResolvedTheme,
      )
    } else setTheme(defaultsDeep(props.theme, baseTheme) as ResolvedTheme)

    if (props.faasClientOptions) FaasReactClient(props.faasClientOptions)
  }, [props.theme])

  if (!theme) return null

  return <ConfigContext.Provider value={{ theme }}>{props.children}</ConfigContext.Provider>
}

/**
 * Read the current `@faasjs/ant-design` config context.
 *
 * @returns Current config context value containing the resolved theme.
 *
 * @example
 * ```tsx
 * import { Blank, ConfigProvider, useConfigContext } from '@faasjs/ant-design'
 *
 * function EmptyState() {
 *   const { theme } = useConfigContext()
 *
 *   return <span>{theme.common.blank}</span>
 * }
 *
 * export function Page() {
 *   return (
 *     <ConfigProvider theme={{ common: { blank: 'N/A' } }}>
 *       <EmptyState />
 *     </ConfigProvider>
 *   )
 * }
 * ```
 */
export function useConfigContext() {
  return useContext(ConfigContext)
}
