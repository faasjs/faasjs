import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Button, ConfigProvider, Layout, Result, Skeleton } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { Route, Switch } from 'react-router-dom'
import { v4 } from 'uuid'
import { faas } from 'libs/faas'

export function App(): JSX.Element {
  const [auth, setAuth] = useState<boolean>()

  useEffect(function () {
    // 检查请求公钥是否存在
    if (localStorage.getItem('accessToken')) {
      setAuth(true)
      return
    }

    // 检查设备编号是否生成
    let deviceId = localStorage.getItem('deviceId')
    if (!deviceId) {
      deviceId = v4()
      localStorage.setItem('deviceId', deviceId)
    }

    // 获取公钥
    faas<{
      version: string
      accessToken: string
      refreshToken: string
    }>('token/create', {
      deviceId,
      version: '1.0',
    }).then(res => {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      setAuth(true)
    })
  }, [])

  if (!auth) return <Skeleton active />

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Suspense fallback={<Skeleton active />}>
          <Switch>
            <Route
              key='/'
              path='/'
              component={lazy(async () => import('pages/home'))}
            />
            <Route
              key='*'
              path='*'
              component={function () {
                return (
                  <Result
                    status='404'
                    title='404'
                    subTitle='你访问的页面不存在'
                    extra={
                      <Button type='primary' href='/'>
                        返回首页
                      </Button>
                    }
                  />
                )
              }}
            />
          </Switch>
        </Suspense>
      </Layout>
    </ConfigProvider>
  )
}
