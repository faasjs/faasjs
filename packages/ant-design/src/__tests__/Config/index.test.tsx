/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Blank } from '../../Blank'
import { Config } from '../../Config'

describe('Blank', () => {
  it('should work', () => {
    render(<>
      <Config config={ { Blank: { text: 'text' } } } />
      <Blank />
    </>)

    expect(screen.getByText('text')).toBeInTheDocument()
  })
})
