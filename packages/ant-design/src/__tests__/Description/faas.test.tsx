import { setMock } from '@faasjs/browser'
import { render, screen } from '@testing-library/react'
import { Description } from '../../Description'

describe('Description/faas', () => {
  beforeEach(() => {
    setMock(async () => ({
      data: { title: 'title', test: 'value' },
    }))
  })

  afterEach(() => {
    setMock(null)
  })

  it('with faas', async () => {
    render(
      <Description
        renderTitle={data => data.title}
        items={[{ id: 'test' }]}
        faasData={{ action: 'test' }}
      />
    )

    expect(await screen.findAllByText('title')).toHaveLength(1)
    expect(await screen.findAllByText('Test')).toHaveLength(1)
    expect(await screen.findAllByText('value')).toHaveLength(1)
  })
})
