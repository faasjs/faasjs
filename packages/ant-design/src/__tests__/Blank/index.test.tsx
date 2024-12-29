import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Blank } from '../../Blank'

describe('Blank', () => {
  it('should work', () => {
    render(<Blank />)

    expect(screen.getByText('Empty')).toBeDefined()
  })
})
