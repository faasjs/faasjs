import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OptionalWrapper } from '../OptionalWrapper'

describe('OptionalWrapper', () => {
  it('should render children without wrapper when condition is false', () => {
    const { container } = render(
      <OptionalWrapper condition={false} Wrapper={() => <div />}>
        <span>Test</span>
      </OptionalWrapper>,
    )
    expect(container.innerHTML).toBe('<span>Test</span>')
  })

  it('should render children with wrapper when condition is true', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <div className='wrapper'>{children}</div>
    )
    const { container } = render(
      <OptionalWrapper condition={true} Wrapper={Wrapper}>
        <span>Test</span>
      </OptionalWrapper>,
    )
    expect(container.querySelector('.wrapper')).not.toBeNull()
    expect(container.querySelector('.wrapper')?.innerHTML).toBe('<span>Test</span>')
  })

  it('should pass wrapperProps to the wrapper component', () => {
    const Wrapper = ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>
    const { container } = render(
      <OptionalWrapper
        condition={true}
        Wrapper={Wrapper}
        wrapperProps={{ className: 'custom-class' }}
      >
        <span>Test</span>
      </OptionalWrapper>,
    )
    expect(container.querySelector('.custom-class')).not.toBeNull()
    expect(container.querySelector('.custom-class')?.innerHTML).toBe('<span>Test</span>')
  })
})
