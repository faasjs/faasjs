import { setMock } from '@faasjs/react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { Description } from '../../Description'

describe('Description/faas', () => {
  beforeEach(() => {
    setMock(async () => ({
      data: { title: 'title', test: 'value' },
    }))
  })

  it('with faas', async () => {
    render(
      <Description
        renderTitle={(data) => data.title}
        items={[{ id: 'test' }]}
        faasData={{ action: 'test' }}
      />,
    )

    expect(await screen.findAllByText('title')).toHaveLength(1)
    expect(await screen.findAllByText('Test')).toHaveLength(1)
    expect(await screen.findAllByText('value')).toHaveLength(1)
  })

  it('with faas without optional props', async () => {
    render(<Description items={[{ id: 'test' }]} faasData={{ action: 'test' }} />)

    expect(await screen.findAllByText('Test')).toHaveLength(1)
    expect(await screen.findAllByText('value')).toHaveLength(1)
  })

  it('passes faasData wrapper props through', async () => {
    setMock(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20))

      return {
        data: { title: 'title', test: 'value' },
      }
    })

    render(
      <Description
        items={[{ id: 'test' }]}
        faasData={{
          action: 'test',
          loading: <div>Loading description</div>,
        }}
      />,
    )

    expect(screen.getByText('Loading description')).toBeDefined()
    expect(await screen.findAllByText('value')).toHaveLength(1)
  })
})
