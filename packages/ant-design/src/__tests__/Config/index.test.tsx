import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Blank } from '../../Blank'
import { ConfigProvider } from '../../Config'
import { PageNotFound } from '../../Routers'

describe('Config', () => {
  it('should work', () => {
    render(
      <ConfigProvider theme={{ Blank: { text: 'text' } }}>
        <Blank />
        <PageNotFound />
      </ConfigProvider>,
    )

    expect(screen.getByText('text')).toBeDefined()
    expect(screen.getByText('No Found')).toBeDefined()
  })

  it('should work with lang', () => {
    render(
      <ConfigProvider theme={{ lang: 'zh', Blank: { text: 'text' } }}>
        <Blank />
        <PageNotFound />
      </ConfigProvider>,
    )

    expect(screen.getByText('text')).toBeDefined()
    expect(screen.getByText('页面未找到')).toBeDefined()
  })

  it('should work with navigator.language', () => {
    const mock = vi.spyOn(window.navigator, 'language', 'get').mockReturnValueOnce('zh-CN')

    render(
      <ConfigProvider theme={{ Blank: { text: 'text' } }}>
        <Blank />
        <PageNotFound />
      </ConfigProvider>,
    )

    expect(screen.getByText('text')).toBeDefined()
    expect(screen.getByText('页面未找到')).toBeDefined()

    mock.mockRestore()
  })
})
