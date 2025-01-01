import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: ['node_modules', 'dist', 'public', 'build.js'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['sibling', 'parent'],
            ['index'],
          ],
          pathGroups: [
            {
              pattern: 'src/routes/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/controllers/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/services/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/repositories/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/models/**',
              group: 'internal',
              position: 'after',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  eslintConfigPrettier,
];
