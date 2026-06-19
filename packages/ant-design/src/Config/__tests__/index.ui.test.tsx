import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Blank } from '../../Blank'
import { ConfigProvider, useConfigContext } from '../../Config'

function ThemeProbe() {
  const { theme } = useConfigContext()

  return (
    <>
      <span>{theme.lang}</span>
      <span>{theme.common.submit}</span>
    </>
  )
}

describe('Config', () => {
  it('should work', () => {
    render(
      <ConfigProvider theme={{ Blank: { text: 'text' }, common: { submit: 'Save' } }}>
        <Blank />
        <ThemeProbe />
      </ConfigProvider>,
    )

    expect(screen.getByText('text')).toBeDefined()
    expect(screen.getByText('en')).toBeDefined()
    expect(screen.getByText('Save')).toBeDefined()
  })

  it('should work with lang', () => {
    render(
      <ConfigProvider theme={{ lang: 'zh', Blank: { text: 'text' } }}>
        <Blank />
        <ThemeProbe />
      </ConfigProvider>,
    )

    expect(screen.getByText('text')).toBeDefined()
    expect(screen.getByText('zh')).toBeDefined()
    expect(screen.getByText('提交')).toBeDefined()
  })

  it('should work with navigator.language', () => {
    const mock = vi.spyOn(window.navigator, 'language', 'get').mockReturnValueOnce('zh-CN')

    render(
      <ConfigProvider theme={{ Blank: { text: 'text' } }}>
        <Blank />
        <ThemeProbe />
      </ConfigProvider>,
    )

    expect(screen.getByText('text')).toBeDefined()
    expect(screen.getByText('zh')).toBeDefined()
    expect(screen.getByText('提交')).toBeDefined()

    mock.mockRestore()
  })
})
