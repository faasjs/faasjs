/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Tabs } from '../../Tabs'

describe('Tabs', () => {
  it('should work', () => {
    render(
      <Tabs
        items={[
          {
            id: 'id',
            children: 'content',
          },
          null,
        ]}
      />
    )

    expect(screen.getByText('id')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
