/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Blank } from '../../Blank'
import { ConfigProvider } from '../../Config'

describe('Config', () => {
  it('should work', () => {
    render(<>
      <ConfigProvider config={ { Blank: { text: 'text' } } }>
        <Blank />
      </ConfigProvider>
    </>)

    expect(screen.getByText('text')).toBeInTheDocument()
  })
})
