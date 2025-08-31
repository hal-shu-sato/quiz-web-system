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
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],

          pathGroups: [
            {
              pattern: '{react,react-dom/**,react-router-dom}',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'parent',
              position: 'before',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin'],

          alphabetize: {
            order: 'asc',
          },

          'newlines-between': 'always',
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],
    },
  },
  eslintConfigPrettier,
);
