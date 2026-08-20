module.exports = {
  extends: [
    'airbnb-base',
    'plugin:security/recommended-legacy',
  ],
  env: {
    browser: true,
    jquery: true,
    node: true,
    es2022: true,
  },
  plugins: [
    'security',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    'security/detect-object-injection': 'off',
  },
  overrides: [
    {
      files: ['src/js/**/*.js', 'tests/unit/**/*.js', 'vite.config.js', 'scripts/**/*.mjs'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'import/extensions': 'off',
      },
    },
    {
      files: [
        '.eleventy.js',
        'playwright.config.js',
        'vite.config.js',
        'vitest.config.js',
        'scripts/**/*.mjs',
        'src/site/_data/**/*.js',
        'src/utils/**/*.js',
        'tests/**/*.js',
      ],
      rules: {
        'import/no-dynamic-require': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'no-await-in-loop': 'off',
        'no-restricted-syntax': 'off',
        'security/detect-non-literal-fs-filename': 'off',
        'security/detect-non-literal-require': 'off',
      },
    },
  ],
};
