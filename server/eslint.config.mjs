// @ts-check

import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist/**', 'node_modules/**', 'src/generated/**'] },
  { languageOptions: { globals: globals.node } },
  eslintConfigPrettier,
);
