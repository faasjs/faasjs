/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import { Description } from '../../Description'
import { setMock, Response } from '@faasjs/browser'

describe('Description/faas', () => {
  beforeEach(() => {
    setMock(async () => {
      return new Response({
        status: 200,
        data: { test: 'value' },
      })
    })
  })

  afterEach(() => {
    setMock(null)
  })

  it('with faas', async () => {
    render(
      <Description
        renderTitle={data => data.test}
        items={[{ id: 'test' }]}
        faasData={{ action: 'test' }}
      />
    )

    expect(await screen.findAllByText('Test')).toHaveLength(1)
    expect(await screen.findAllByText('value')).toHaveLength(2)
  })
})
