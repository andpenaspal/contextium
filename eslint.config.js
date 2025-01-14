import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

/** @type {import('eslint').FlatConfig} */
export default tsEslint.config(
  {
    files: ['**/*.{spec,test}.ts'],
    extends: [vitest.configs.recommended],
    rules: {
      'vitest/no-disabled-tests': 'error',
      'vitest/consistent-test-filename': [
        'error',
        { pattern: '.*\\.spec\\.(ts)$' },
      ],
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
      'vitest/no-conditional-expect': 'error',
      'vitest/no-conditional-in-test': 'error',
      'vitest/no-conditional-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/prefer-each': 'error',
      'vitest/prefer-expect-resolves': 'error',
      'vitest/prefer-hooks-in-order': 'error',
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/prefer-spy-on': 'error',
      'vitest/require-top-level-describe': 'error',
      'vitest/prefer-todo': 'error',
      'vitest/no-focused-tests': 'warn',
      'vitest/padding-around-all': 'warn',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    extends: [
      eslint.configs.recommended,
      tsEslint.configs.recommendedTypeChecked,
      tsEslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: globals.node,
    },
    ignores: [
      'node_modules',
      'dist',
      'public',
      'build.js',
      'eslint.config.js',
      'vitest.config.ts',
    ],
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      import: eslintPluginImport,
    },
    ...eslintConfigPrettier,
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
            {
              pattern: 'src/servers/**',
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

      'no-throw-literal': 'error',
      'require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],
      'no-shadow': ['error', { hoist: 'all' }],
      'no-console': ['warn'],
      'default-case': 'error',
      'no-loop-func': 'error',
      'no-useless-catch': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/*.test.ts', '**/*.spec.ts'] },
      ],
      'import/no-cycle': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      complexity: ['warn', 10],
      'max-depth': ['warn', 4],
      'prefer-const': 'error',
      'no-var': 'error',
      camelcase: 'off',

      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        {
          selector: 'enum',
          format: ['UPPER_CASE'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
      ],
    },
  }
);
