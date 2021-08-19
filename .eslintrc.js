module.exports = {
  root: true,
  globals: {
    document: true
  },
  extends: 'airbnb-base',
  rules: {
    'no-underscore-dangle': 0,
    'func-names': 0,
    'no-plusplus': 0,
    'comma-dangle': [2, 'never'],
    'no-console': 'off',
    'max-len': ['error', { code: 300 }],
    'no-else-return': ['error', { allowElseIf: true }],
    'max-classes-per-file': ['error', 2]
  }
};
