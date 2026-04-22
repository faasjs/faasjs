import { setMock } from '@faasjs/react'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vite-plus/test'

type MatchMediaMock = (query: string) => MediaQueryList
type LegacyMediaQueryListListener = (this: MediaQueryList, event: MediaQueryListEvent) => void
type MediaQueryListListenerMock = (listener: LegacyMediaQueryListListener | null) => void
type MediaQueryListEventListenerMock = (
  type: string,
  listener: EventListenerOrEventListenerObject | null,
  options?: boolean | AddEventListenerOptions,
) => void
type MediaQueryListDispatchEventMock = (event: Event) => boolean
type ResizeObserverObserveMock = (target: Element, options?: ResizeObserverOptions) => void
type ResizeObserverUnobserveMock = (target: Element) => void
type ResizeObserverDisconnectMock = () => void

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn<MatchMediaMock>().mockImplementation(
    (query) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn<MediaQueryListListenerMock>(),
        removeListener: vi.fn<MediaQueryListListenerMock>(),
        addEventListener: vi.fn<MediaQueryListEventListenerMock>(),
        removeEventListener: vi.fn<MediaQueryListEventListenerMock>(),
        dispatchEvent: vi.fn<MediaQueryListDispatchEventMock>(() => true),
      }) satisfies MediaQueryList,
  ),
})

class ResizeObserverMock {
  observe = vi.fn<ResizeObserverObserveMock>()
  unobserve = vi.fn<ResizeObserverUnobserveMock>()
  disconnect = vi.fn<ResizeObserverDisconnectMock>()
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

beforeEach(() => {
  document.body.innerHTML = ''
  window.fetch = fetch
  window.history.replaceState(null, '', '/')
})

afterEach(() => {
  cleanup()
  setMock(null)
})
