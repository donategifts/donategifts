const antfu = require('@antfu/eslint-config').default;
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat();

module.exports = antfu({
    root: true,

    ...compat.config({
        extends: ['next', 'turbo'],

        settings: {
            next: {
                rootDir: ['apps/*/'],
            },
        },

        overrides: [
            {
                files: ['./apps/web/**/*.{ts,tsx}'],
                extends: ['next/core-web-vitals'],
            },
        ],
    }),

    rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'node/prefer-global/process': 'off',
        'style/brace-style': ['error', '1tbs'],
        'style/comma-dangle': ['error', 'always-multiline'],
        'style/eol-last': ['error', 'always'],
        'style/linebreak-style': ['error', 'unix'],
        'style/quote-props': ['error', 'as-needed'],
        'style/quotes': ['error', 'single', { avoidEscape: true }],
        curly: ['error', 'all'],
    },

    stylistic: {
        indent: 4,
        semi: true,
    },

    ignores: [
        '.vscode',
        '.husky',
    ],

    formatters: {
        css: true,
        html: true,
    },

    react: true,
    yaml: false,
});
