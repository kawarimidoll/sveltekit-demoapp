import antfu from '@antfu/eslint-config';
import { rootConfig } from '../../eslint.config.js';

export default antfu({
  /* main options */
  ...{ unocss: true },
  ...rootConfig,
}, {
  files: ['messages/*.json'],
  rules: {
    'jsonc/key-name-casing': 'error',
  },
}, {
  // apply 'no-console' only '.svelte' files
  files: ['**/*.svelte'],
  rules: { 'no-console': 'error' },
});
