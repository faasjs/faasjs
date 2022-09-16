/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Link } from '../../Link'
import { BrowserRouter } from 'react-router-dom'

describe('Link', () => {
  it('should work', async function () {
    render(<BrowserRouter>
      <Link
        href='/'
        text='text' />
    </BrowserRouter>)

    expect(screen.getByText('text')).toBeInTheDocument()
  })
})
