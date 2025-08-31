import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = tseslint.config(
  compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    languageOptions: {
      ecmaVersion: 2017,
      sourceType: 'script',
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintConfigPrettier,
);

export default eslintConfig;
