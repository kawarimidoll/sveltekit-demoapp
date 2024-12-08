import antfu from '@antfu/eslint-config';
import { plugin as drizzlePlugin } from './shared/eslint-rules/drizzle-table-name-snake-case.js';

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
    // apply 'no-console' only '.svelte' files below
    'no-console': 'off',
  },

  /* style rules */
  stylistic: {
    semi: true,
  },

  /* workaround: eslint doesn't follow .gitignore for some reason */
  ignores: ['**/src/lib/paraglide'],
}, {
  files: ['messages/*.json'],
  rules: {
    'jsonc/key-name-casing': 'error',
  },
}, {
  // apply 'no-console' only '.svelte' files
  files: ['**/*.svelte'],
  rules: { 'no-console': 'error' },
}, {
  plugins: { drizzlePlugin },
  rules: {
    'drizzlePlugin/drizzle-table-name-snake-case': 'error',
  },
});
