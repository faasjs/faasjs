import { faas, useApp } from '@faasjs/ant-design'
import { Button, Card, Input, Space, Typography } from 'antd'
import { useState } from 'react'

type HelloResponse = {
  message?: string
}

export default function HomePage() {
  const app = useApp()
  const [name, setName] = useState('FaasJS')
  const [messageText, setMessageText] = useState('Click button to call API')
  const [loading, setLoading] = useState(false)

  const callApi = async () => {
    setLoading(true)

    try {
      const response = await faas('/pages/home/api/hello', {
        name: name.trim() || undefined,
      })
      const nextMessage = (response.data as HelloResponse | undefined)?.message || 'Empty response'

      setMessageText(nextMessage)
      app.message.success('API call succeeded')
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
          maxWidth: 560,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Typography.Title level={2}>FaasJS Ant Design App</Typography.Title>
            <Typography.Paragraph type="secondary">
              Call a FaasJS API through the Ant Design app shell.
            </Typography.Paragraph>
          </div>

          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="What should the API greet?"
          />

          <Button type="primary" loading={loading} onClick={callApi}>
            Call /pages/home/api/hello
          </Button>

          <Typography.Paragraph style={{ marginBottom: 0 }}>{messageText}</Typography.Paragraph>
        </Space>
      </Card>
    </div>
  )
}
