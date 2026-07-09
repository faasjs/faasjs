import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Loading } from '../../Loading'

function styleToReactCSS(cssDeclaration: CSSStyleDeclaration): React.CSSProperties {
  const reactStyle: Record<string, unknown> = {}

  for (let i = 0; i < cssDeclaration.length; i++) {
    const kebabKey = cssDeclaration[i]
    const value = cssDeclaration.getPropertyValue(kebabKey)

    if (!value) continue

    const camelCaseKey = kebabKey.startsWith('--')
      ? kebabKey
      : kebabKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

    reactStyle[camelCaseKey] = value
  }

  return reactStyle as React.CSSProperties
}

describe('Loading', () => {
  it('should work', () => {
    const { container } = render(<Loading />)

    expect(container.innerHTML).toContain('ant-spin-dot')
  })

  it('should work with children', () => {
    render(<Loading loading={false}>children</Loading>)

    expect(screen.getByText('children')).toBeDefined()
  })

  it('should work with full', () => {
    const { container } = render(<Loading full />)
    const wrapper = container.firstElementChild as HTMLDivElement

    expect(styleToReactCSS(wrapper.style)).toMatchObject({
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0%',
      justifyContent: 'center',
    })
  })
})
