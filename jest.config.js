module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testTimeout: 10000,
  collectCoverage: true,
  testRegex: '/*\\.test\\.ts$',
  testPathIgnorePatterns: [
    '/lib/',
    '/tmp/',
    '/examples/'
  ],
  coveragePathIgnorePatterns: [
    '/lib/',
    '/tmp/',
    '/__tests__/',
    '/examples/'
  ],
  moduleNameMapper: { '@faasjs/(.*)': '<rootDir>/./packages/$1/src' },
  setupFiles: [
    './packages/test/src/jest.setup'
  ]
}
