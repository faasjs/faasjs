import { Result, Skeleton } from 'antd'
import { ComponentType, LazyExoticComponent, Suspense } from 'react'
import { Routes as OriginRoutes, Route, RouteProps } from 'react-router-dom'
import { useConfigContext } from './Config'

export { lazy } from 'react'

export function PageNotFound() {
  const config = useConfigContext()

  return <Result status='404' title={config.common.pageNotFound} />
}

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
      {props.routes.map(r => (
        <Route
          key={r.path as string}
          {...r}
          element={
            r.element || (
              <Suspense
                fallback={
                  props.fallback || (
                    <div style={{ padding: '24px' }}>
                      <Skeleton active />
                    </div>
                  )
                }
              >
                <r.page />
              </Suspense>
            )
          }
        />
      ))}
      <Route key='*' path='*' element={props.notFound || <PageNotFound />} />
    </OriginRoutes>
  )
}
