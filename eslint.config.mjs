import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'prefer-const': 'warn',
      'no-constant-binary-expression': 'error',
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'arrow-body-style': ['error'],
      'no-console': ['error'],
      'no-unused-vars': 'off', // Disable the default rule for unused variables
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all' }] // Enable TypeScript-specific rule for unused variables
    }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended
];
