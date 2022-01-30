import { Result, Skeleton } from 'antd'
import {
  ComponentType, LazyExoticComponent, Suspense
} from 'react'
import {
  Routes as OriginRoutes, Route, RouteProps
} from 'react-router-dom'

function NoMatch () {
  return <Result
    status="404"
    title="404"
    subTitle="Page not found"
  />
}

export type RoutesProps = {
  routes: (RouteProps & {
    page?: LazyExoticComponent<ComponentType<any>>
  })[]
  notFound?: JSX.Element
}

export function Routes (props: RoutesProps) {
  return <OriginRoutes>{
    props.routes.map(r => <Route
      key={ r.path as string }
      { ...r }
      element={ r.element || <Suspense fallback={ <Skeleton active /> }>
        <r.page />
      </Suspense> }
    />)
  }<Route
    key='*'
    path='*'
    element={ props.notFound || <NoMatch /> }
  />
  </OriginRoutes>
}
