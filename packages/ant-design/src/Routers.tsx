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
 * <Routes
 *   routes={[{ path: '/', element: <div>Home</div> }]}
 *   notFound={<PageNotFound />}
 * />
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
  routes: (RouteProps & {
    page?: LazyExoticComponent<ComponentType<any>>
  })[]
  fallback?: JSX.Element
  notFound?: JSX.Element
}

/**
 * Routes with lazy loading and 404 page.
 *
 * @example
 * ```tsx
 * import { Routes, lazy } from '@faasjs/ant-design'
 * import { BrowserRouter } from 'react-router-dom'
 *
 * export function App () {
 *   return <BrowserRouter>
 *     <Routes routes={[
 *       {
 *         path: '/',
 *         page: lazy(() => import('./pages/home'))
 *       }
 *     ]} />
 *   </BrowserRouter>
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
