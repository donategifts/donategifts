module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		project: './tsconfig.eslint.json',
	},
	plugins: ['prettier', '@typescript-eslint', 'unicorn', 'import', 'mocha'],
	globals: {
		io: true,
	},
	rules: {
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
		'max-len': 0,
		// Enforce import order
		'import/order': 'error',
		// Imports should come first
		'import/first': 'error',
		// Other import rules
		'import/no-mutable-exports': 'error',
		// Allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		// Allow console log during development, but put out warnings, except for warn and error
		'no-console': [
			process.env.NODE_ENV === 'production' ? 'error' : 'warn',
			{ allow: ['warn', 'error'] },
		],
		// Prefer const over let
		'prefer-const': [
			'error',
			{
				destructuring: 'any',
				ignoreReadBeforeAssign: false,
			},
		],
		// No single if in an "else" block
		'no-lonely-if': 'error',

		'import/no-unresolved': 'off',

		'no-underscore-dangle': 0,

		'object-curly-spacing': 0,

		'prefer-object-spread': 'error',

		'no-plusplus': 'warn',

		'no-param-reassign': 'warn',

		'no-throw-literal': 'warn',
		// Force curly braces for control flow,
		// including if blocks with a single statement
		curly: ['error', 'all'],
		// Force dot notation when possible
		'dot-notation': 'error',

		'no-var': 'error',
		// Force object shorthand where possible
		'object-shorthand': 'error',
		// No useless destructuring/importing/exporting renames
		'no-useless-rename': 'error',

		'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

		'require-atomic-updates': 0,

		'no-await-in-loop': 0,

		'class-methods-use-this': 0,

		'no-useless-constructor': 0,

		'import/prefer-default-export': 0,

		'eol-last': 0,

		'@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],

		'@typescript-eslint/no-useless-constructor': 0,

		'@typescript-eslint/no-parameter-properties': 0,

		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'interface',
				format: ['PascalCase'],
				prefix: ['I'],
			},
		],

		'@typescript-eslint/interface-name-prefix': 'off',

		'@typescript-eslint/camelcase': 'off',

		'@typescript-eslint/explicit-member-accessibility': 0,

		indent: [2, 'tab', { SwitchCase: 1 }],

		// Allow unresolved imports
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				mjs: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
		/** ******************* */
		/*   Unicorn Rules    */
		/** ******************* */
		// Pass error messaging when throwing errors
		'unicorn/error-message': 'error',
		// Uppercase regex escapes
		'unicorn/escape-case': 'error',
		// Array.isArray instead of instanceof
		'unicorn/no-array-instanceof': 'error',
		// Prevent deprecated `new Buffer()`
		'unicorn/no-new-buffer': 'error',
		// Keep regex literals safe!
		'unicorn/no-unsafe-regex': 'off',
		// Lowercase number formatting for octal, hex, binary (0x12 instead of 0X12)
		'unicorn/number-literal-case': 'error',
		// ** instead of Math.pow()
		'unicorn/prefer-exponentiation-operator': 'error',
		// includes over indexOf when checking for existence
		'unicorn/prefer-includes': 'error',
		// String methods startsWith/endsWith instead of more complicated stuff
		'unicorn/prefer-starts-ends-with': 'error',
		// textContent instead of innerText
		'unicorn/prefer-text-content': 'error',
		// Enforce throwing type error when throwing error while checking typeof
		'unicorn/prefer-type-error': 'error',
		// Use new when throwing error
		'unicorn/throw-new-error': 'error',
	},
	env: {
		jest: true,
		mocha: true,
		browser: true,
		node: true,
	},
	// order important, keep as is
	extends: [
		'airbnb-typescript/base',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/@typescript-eslint',
		'prettier/standard',
	],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
		'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
	},
};
