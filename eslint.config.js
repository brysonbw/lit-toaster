import eslint from '@eslint/js';
import pluginSecurity from 'eslint-plugin-security';
import liteslint from 'eslint-plugin-lit';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

const securityRulesAsErrors = Object.fromEntries(
  Object.entries(pluginSecurity.configs.recommended.rules).map(([rule]) => [
    rule,
    'error',
  ])
);

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  liteslint.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {},
    rules: {
      ...securityRulesAsErrors,
      // Prettier
      'prettier/prettier': 'error',
      // Typescript
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/prefer-for-of': 'off',
      // Lit
      'lit/no-legacy-template-syntax': 'error',
      'lit/no-template-arrow': 'off',
    },
  },
  // Override rules for specific files
  {
    files: ['**/*.test.ts', '**/*.config.ts'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'jsdoc/require-jsdoc': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
