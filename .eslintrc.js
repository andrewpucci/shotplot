module.exports = {
  extends: [
    'airbnb-base',
    'plugin:security/recommended',
  ],
  env: {
    browser: true,
    jquery: true,
    node: true,
  },
  plugins: [
    'security',
  ],
};
