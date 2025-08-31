import path from 'node:path';

/** @type {import('lint-staged').SyncGenerateTask} */
const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;
const prettierCommand = 'prettier --write';

/** @type {import('lint-staged').Configuration} */
const lintStagedConfig = {
  '*.{ts,tsx}': [
    () => 'tsc --incremental false --noEmit',
    buildEslintCommand,
    prettierCommand,
  ],
  '*.{js,jsx}': [buildEslintCommand, prettierCommand],
  '**/*': prettierCommand + ' --ignore-unknown',
};

export default lintStagedConfig;
