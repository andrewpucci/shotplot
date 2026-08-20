const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: [
        'src/filters/**/*.js',
        'src/utils/**/*.js',
        'src/site/_data/**/*.js',
        'src/js/shot-logic.js',
        'src/js/shot-dom.js',
      ],
      thresholds: {
        lines: 80,
        functions: 85,
        statements: 80,
        branches: 70,
      },
    },
  },
});
