import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  features: {
    typescript: {
      strict: true,
    },
    stylistic: {
      semi: true,
      indent: 2,
    },
  },
}).prepend({
  ignores: ['**/types'],
}).override('nuxt/import/rules', {
  rules: {
    'import/order': ['error', {
      'groups': [
        'type',
        ['builtin', 'external'],
        ['internal', 'parent', 'sibling', 'index', 'object'],
      ],
      'newlines-between': 'always',
      'alphabetize': {
        order: 'asc',
      },
    }],
  },
}).append({
  rules: {
    'prefer-template': ['error'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
});
