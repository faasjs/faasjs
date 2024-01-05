/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Tabs } from '../../Tabs'

describe('Tabs', () => {
  it('should work', async () => {
    render(
      <Tabs
        items={[
          {
            id: 'id',
            children: 'content',
          },
          false && {
            id: 'hidden',
            children: 'content',
          },
        ]}
      />
    )

    expect(screen.getByText('id')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
    expect(screen.queryByText('hidden')).not.toBeInTheDocument()
  })
})
