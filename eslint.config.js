import antfu from '@antfu/eslint-config';

export const rootConfig = {
  /* options */
  lessopinionated: true,
  formatters: true,
  svelte: true,
  yaml: true,
  markdown: true,

  /* general rules */
  rules: {
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'curly': ['error', 'all'],
    'antfu/top-level-function': 'error',
    // apply 'no-console' only '.svelte' files in each project
    'no-console': 'off',
  },

  /* style rules */
  stylistic: {
    semi: true,
  },

  /* workaround: eslint doesn't follow .gitignore for some reason */
  ignores: ['**/src/lib/paraglide'],
};

export default antfu(rootConfig);
