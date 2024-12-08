import antfu from '@antfu/eslint-config';
import { plugin as drizzlePlugin } from '@shared/eslint-rules/drizzle-table-name-snake-case.js';
import { rootConfig } from '../../eslint.config.js';

export default antfu(
  rootConfig,
  {
    plugins: { drizzlePlugin },
    rules: {
      'drizzlePlugin/drizzle-table-name-snake-case': 'error',
    },
  },
);
