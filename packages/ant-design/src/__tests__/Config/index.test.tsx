/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import { Blank } from '../../Blank'
import { ConfigProvider } from '../../Config'
import { PageNotFound } from '../../Routers'

describe('Config', () => {
  it('should work', () => {
    render(
      <ConfigProvider theme={{ lang: 'zh', Blank: { text: 'text' } }}>
        <Blank />
        <PageNotFound />
      </ConfigProvider>
    )

    expect(screen.getByText('text')).toBeDefined()
    expect(screen.getByText('页面未找到')).toBeDefined()
  })
})
