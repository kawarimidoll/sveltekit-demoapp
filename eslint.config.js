import antfu from '@antfu/eslint-config';

export default antfu({
  /* options */
  lessopinionated: true,
  formatters: true,
  svelte: true,
  unocss: true,
  yaml: true,
  markdown: true,

  /* general rules */
  rules: {
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'curly': ['error', 'all'],
    'antfu/top-level-function': 'error',
  },

  /* style rules */
  stylistic: {
    semi: true,
  },
});