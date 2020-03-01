module.exports = {
  preset: 'ts-jest',
  verbose: true,
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
  moduleNameMapper: {
    '@faasjs/(.*)': '<rootDir>/./packages/$1/src'
  }
};
