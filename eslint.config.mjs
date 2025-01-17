import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    ignores: ['**/types']
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
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
      ],
      'vue/no-v-html': 'off',
      'vue/html-self-closing': 'off',
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ]
    }
  }
);
