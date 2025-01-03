import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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

    expect(screen.getByText('id')).toBeDefined()
    expect(screen.getByText('content')).toBeDefined()
    expect(screen.queryByText('hidden')).toBeNull()
  })
})
