import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/',
      'client/.next/',
      'client/build/',
      'client/out/',
      'client/next-env.d.ts',
      'server/dist/',
      'server/src/generated/',
    ],
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs', 'client/*.mjs', 'server/*.mjs'],
        },
      },
    },
  },
  eslintConfigPrettier,
);
