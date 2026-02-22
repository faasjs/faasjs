import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Blank } from '../../Blank'

describe('Blank', () => {
  it('should work', () => {
    render(<Blank />)

    expect(screen.getByText('Empty')).toBeDefined()
  })

  it('should return blank text for empty values', () => {
    const { rerender } = render(<Blank value={null} />)

    expect(screen.getByText('Empty')).toBeDefined()

    rerender(<Blank value={undefined} text='No Data' />)
    expect(screen.getByText('No Data')).toBeDefined()

    rerender(<Blank value={[]} />)
    expect(screen.getByText('Empty')).toBeDefined()

    rerender(<Blank value='' />)
    expect(screen.getByText('Empty')).toBeDefined()
  })

  it('should render the original value when not empty', () => {
    render(<Blank value='value' />)

    expect(screen.getByText('value')).toBeDefined()
  })
})
