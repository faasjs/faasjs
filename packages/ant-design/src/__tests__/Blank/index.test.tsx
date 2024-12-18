/**
 * @jest-environment @happy-dom/jest-environment
 */

import { render, screen } from '@testing-library/react'
import { Blank } from '../../Blank'

describe('Blank', () => {
  it('should work', () => {
    render(<Blank />)

    expect(screen.getByText('Empty')).toBeDefined()
  })
})
