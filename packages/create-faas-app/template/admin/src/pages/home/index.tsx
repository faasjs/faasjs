import { faas, useApp } from '@faasjs/ant-design'
import { Button, Card, Input, Space, Typography } from 'antd'
import { useState } from 'react'

type CreateUserResponse = {
  message?: string
  total?: number
  user?: {
    id: number
    name: string
  }
}

export default function HomePage() {
  const app = useApp()
  const [name, setName] = useState('FaasJS')
  const [messageText, setMessageText] = useState('Create your first user through the FaasJS API')
  const [loading, setLoading] = useState(false)

  const callApi = async () => {
    setLoading(true)

    try {
      const response = await faas('/pages/home/api/users/create', {
        name: name.trim() || undefined,
      })
      const data = (response.data as CreateUserResponse | undefined) || undefined
      const nextMessage =
        data?.user && typeof data.total === 'number'
          ? `Created ${data.user.name} (#${data.user.id}). Total users: ${data.total}`
          : data?.message || 'Empty response'

      setMessageText(nextMessage)
      app.message.success('User saved to PostgreSQL')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed'

      setMessageText(errorMessage)
      app.notification.error({
        message: 'API call failed',
        description: errorMessage,
      })
    } finally {
      setLoading(false)
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
              This starter follows the recommended FaasJS path: React, Ant Design, PostgreSQL, and
              pg-dev-powered tests.
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

          <Button type="primary" loading={loading} onClick={callApi}>
            Create /pages/home/api/users/create
          </Button>

          <Typography.Paragraph style={{ marginBottom: 0 }}>{messageText}</Typography.Paragraph>
        </Space>
      </Card>
    </div>
  )
}
