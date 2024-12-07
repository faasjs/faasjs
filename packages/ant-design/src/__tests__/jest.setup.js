if (typeof window !== 'undefined') {
  global.React = require('react')

  // TODO: enable whyDidYouRender when it works with React 19
  // const whyDidYouRender = require('@welldone-software/why-did-you-render')
  // whyDidYouRender(React, {
  //   trackAllPureComponents: true,
  //   logOnDifferentValues: true,
  // })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}
