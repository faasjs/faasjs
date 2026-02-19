import type { ComponentProps, ComponentType, ReactNode } from 'react'

export type OptionalWrapperProps<TWrapper extends ComponentType<{ children: ReactNode }> = any> = {
  condition: boolean
  Wrapper: TWrapper
  wrapperProps?: ComponentProps<TWrapper>
  children: ReactNode
}

/**
 * A wrapper component that conditionally wraps its children with a provided wrapper component.
 *
 * @example
 * ```tsx
 * import { OptionalWrapper } from '@faasjs/react'
 *
 * const Wrapper = ({ children }: { children: React.ReactNode }) => (
 *   <div className='wrapper'>{children}</div>
 * )
 *
 * const App = () => (
 *   <OptionalWrapper condition={true} Wrapper={Wrapper}>
 *     <span>Test</span>
 *   </OptionalWrapper>
 * )
 * ```
 */
export function OptionalWrapper({
  condition,
  Wrapper,
  wrapperProps,
  children,
}: OptionalWrapperProps) {
  if (condition) return <Wrapper {...wrapperProps}>{children}</Wrapper>

  return children
}

OptionalWrapper.displayName = 'OptionalWrapper'
