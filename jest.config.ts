module.exports = {
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  // transformIgnorePatterns: [ '/node_modules/', '^.+\\.js?$' ],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(js|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
