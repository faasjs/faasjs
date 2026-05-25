declare module '@faasjs/types' {
  interface FaasActions {
    '/pages/home/api/users/list': {
      Params: { limit: number }
      Data: { total?: number; rows?: { id: number; name: string }[] }
    }
    '/pages/home/api/users/create': {
      Params: { name?: string | undefined }
      Data: { message?: string; total?: number; user?: { id: number; name: string } }
    }
    '/pages/home/api/users/update': {
      Params: { id: number; name: string }
      Data: { message?: string; user?: { id: number; name: string } }
    }
    '/pages/home/api/users/detail': {
      Params: { id: number }
      Data: { user?: { id: number; name: string } }
    }
    '/pages/home/api/auth/me': {
      Params: Record<string, never>
      Data: { current_user?: { id: number; name: string; role: string } }
    }
  }
}

import { faas, useApp } from '@faasjs/ant-design'
import { useFaas } from '@faasjs/react'
import { Button, Card, Input, Space, Table, Typography } from 'antd'
import { useState } from 'react'

export default function HomePage() {
  const app = useApp()
  const [name, setName] = useState('FaasJS')
  const [messageText, setMessageText] = useState('Create your first user through the FaasJS API')

  const {
    data: listData,
    loading: listLoading,
    reload,
  } = useFaas('/pages/home/api/users/list', { limit: 10 })

  const rows = listData?.rows || []

  const [creating, setCreating] = useState(false)
  const callApi = async () => {
    setCreating(true)
    try {
      const response = await faas('/pages/home/api/users/create', {
        name: name.trim() || undefined,
      })
      const result = response.data
      const nextMessage =
        result?.user && typeof result.total === 'number'
          ? `Created ${result.user.name} (#${result.user.id}). Total users: ${result.total}`
          : result?.message || 'Empty response'

      setMessageText(nextMessage)
      app.message.success('User saved to PostgreSQL')
      await reload()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed'
      setMessageText(errorMessage)
      app.notification.error({
        message: 'API call failed',
        description: errorMessage,
      })
    } finally {
      setCreating(false)
    }
  }

  const [authLoading, setAuthLoading] = useState(false)
  const callAuthDemo = async () => {
    setAuthLoading(true)
    try {
      const response = await faas(
        '/pages/home/api/auth/me',
        {},
        {
          headers: { authorization: 'Bearer demo-admin' },
        },
      )
      const currentUser = response.data?.current_user
      setMessageText(`Auth plugin injected current user: ${currentUser?.name || 'unknown'}`)
      app.message.success('Auth plugin demo loaded current_user')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Auth demo failed'
      setMessageText(errorMessage)
      app.notification.error({
        message: 'Auth demo failed',
        description: errorMessage,
      })
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 640,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Typography.Title level={2}>FaasJS Admin App</Typography.Title>
            <Typography.Paragraph type="secondary">
              This starter follows the curated FaasJS path: React, Ant Design, PostgreSQL,
              pg-dev-powered tests, and a simple auth plugin demo.
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary">
              Set <code>DATABASE_URL</code> from <code>.env.example</code> and run{' '}
              <code>npm run db:migrate</code> before using the page in development.
            </Typography.Paragraph>
          </div>

          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Who should the admin app create?"
          />

          <Space wrap>
            <Button onClick={() => reload()} loading={listLoading}>
              Load users slice
            </Button>
            <Button type="primary" loading={creating} onClick={callApi}>
              Create /pages/home/api/users/create
            </Button>
            <Button loading={authLoading} onClick={callAuthDemo}>
              Call auth plugin demo
            </Button>
          </Space>

          <Table
            rowKey="id"
            size="small"
            pagination={false}
            loading={listLoading}
            dataSource={rows}
            columns={[
              { title: 'ID', dataIndex: 'id' },
              { title: 'Name', dataIndex: 'name' },
            ]}
          />

          <Typography.Paragraph style={{ marginBottom: 0 }}>{messageText}</Typography.Paragraph>
        </Space>
      </Card>
    </div>
  )
}
