import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt()
  .prepend({
    ignores: ['**/types']
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off'
    }
  })
  .override('nuxt/import/rules', {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index', 'object']
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc'
          }
        }
      ]
    }
  })
  .append({
    rules: {
      'prefer-template': ['error'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  });
