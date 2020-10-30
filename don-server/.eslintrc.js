module.exports = {
  extends: ['airbnb-typescript', 'prettier', 'prettier/standard', 'prettier/@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: ['mocha', 'prettier'],
  env: {
    mocha: true,
  },
  rules: {
    camelcase: 'off',
    'no-plusplus': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'global-require': 'off',
    '@typescript-eslint/naming-convention': 'off',
  },
  globals: {
    io: true,
  },
};
