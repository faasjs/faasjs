import { render, screen } from '@testing-library/react'
import { ConfigProvider } from 'antd'
import { describe, expect, it } from 'vitest'
import { useThemeToken } from '../useThemeToken'

describe('useThemeToken', () => {
  it('should return the theme token from the Ant Design theme configuration', () => {
    function Test() {
      const { colorPrimary } = useThemeToken()

      return <span>{colorPrimary}</span>
    }

    function App() {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#000000',
            },
          }}
        >
          <Test />
        </ConfigProvider>
      )
    }

    render(<App />)

    expect(screen.getByText('#000000')).not.toBeNull()
  })
})
