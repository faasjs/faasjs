import { Result, Skeleton } from 'antd'
import {
  ComponentType, LazyExoticComponent, Suspense
} from 'react'
import {
  Routes, Route, RouteProps
} from 'react-router-dom'

function NoMatch () {
  return <Result
    status="404"
    title="404"
    subTitle="Page not found"
  />
}

export function BRoutes (props: {
  routes: (RouteProps & {
    page: LazyExoticComponent<ComponentType<any>>
  })[]
}) {
  return <Routes>{
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
    element={ <NoMatch /> }
  />
  </Routes>
}
