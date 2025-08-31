import path from 'node:path';

/** @type {import('lint-staged').ConfigFn} */
const buildEslintCommand = (filenames) =>
  `eslint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;
const prettierCommand = 'prettier --write';

/** @type {import('lint-staged').Config} */
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
