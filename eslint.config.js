const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const securityPlugin = require('eslint-plugin-security');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/site/assets/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
    },
  },
  js.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      security: securityPlugin,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...securityPlugin.configs.recommended.rules,

      'no-console': 'off',
      'no-alert': 'off',

      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: [
      '.eleventy.js',
      'eslint.config.js',
      'src/filters/**/*.js',
      'src/utils/**/*.js',
      'src/site/_data/**/*.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['vite.config.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
];
