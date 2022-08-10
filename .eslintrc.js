module.exports = {
  env: {
    es2020: true,
    node: true,
    mocha: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'max-len': ['error', 150],
    'import/no-unresolved': 'off',
    'no-useless-constructor': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn', // or error
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'import/extensions': 'off',
    'no-empty-function': 'off',
    indent: ['error', 2],
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'operator-linebreak': 'off',
  },
  overrides: [
    {
      files: ['./src/main.ts', './src/components/app/app.module.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
