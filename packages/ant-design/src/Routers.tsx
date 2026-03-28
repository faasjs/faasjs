import { Result, Skeleton } from 'antd'
import { type ComponentType, type JSX, type LazyExoticComponent, Suspense } from 'react'
import { Routes as OriginRoutes, Route, type RouteProps } from 'react-router-dom'

import { useConfigContext } from './Config'

export { lazy } from 'react'

/**
 * Default 404 route element that uses the configured localized title.
 *
 * @example
 * ```tsx
 * import { PageNotFound, Routes } from '@faasjs/ant-design'
 *
 * export function AppRoutes() {
 *   return (
 *     <Routes
 *       routes={[{ path: '/', element: <div>Home</div> }]}
 *       notFound={<PageNotFound />}
 *     />
 *   )
 * }
 * ```
 */
export function PageNotFound() {
  const { theme } = useConfigContext()

  return <Result status="404" title={theme.common.pageNotFound} />
}

/**
 * Props for the lazy-loading {@link Routes} wrapper.
 */
export interface RoutesProps {
  /** Route records forwarded to React Router, with optional lazy `page` components. */
  routes: (RouteProps & {
    page?: LazyExoticComponent<ComponentType<any>>
  })[]
  /** Fallback element rendered while lazy pages are loading. */
  fallback?: JSX.Element
  /** Element rendered for the generated catch-all 404 route. */
  notFound?: JSX.Element
}

/**
 * Render React Router routes with lazy-page support and a default 404 route.
 *
 * The wrapper adds a catch-all route automatically and uses an Ant Design `Skeleton` fallback when
 * `fallback` is not provided.
 *
 * @param {RoutesProps} props - Route definitions and optional fallback or 404 elements.
 *
 * @example
 * ```tsx
 * import { Routes, lazy } from '@faasjs/ant-design'
 * import { BrowserRouter } from 'react-router-dom'
 *
 * export function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes
 *         routes={[
 *           {
 *             path: '/',
 *             page: lazy(() => import('./pages/home')),
 *           },
 *         ]}
 *       />
 *     </BrowserRouter>
 *   )
 * }
 * ```
 */
export function Routes(props: RoutesProps) {
  return (
    <OriginRoutes>
      {props.routes.map((r) => {
        const Page = r.page

        return (
          <Route
            key={r.path as string}
            {...r}
            element={
              r.element ||
              (Page ? (
                <Suspense
                  fallback={
                    props.fallback || (
                      <div style={{ padding: '24px' }}>
                        <Skeleton active />
                      </div>
                    )
                  }
                >
                  <Page />
                </Suspense>
              ) : undefined)
            }
          />
        )
      })}
      <Route key="*" path="*" element={props.notFound || <PageNotFound />} />
    </OriginRoutes>
  )
}
