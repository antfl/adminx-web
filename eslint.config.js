import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Vue
  {
    files: ['**/*.vue', '**/*.tsx'],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parser: (await import('vue-eslint-parser')).default,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
    },
  },

  // TypeScript
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-undef': 'off',
      'vue/require-default-prop': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        1,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Prettier
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...prettier.rules,
      'prettier/prettier': 'warn',
      'no-console': 'error',
    },
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    ignores: [
      '**/node_modules/**',
      '**/*.local',
      '**/.vscode/**',
      '**/.idea/**',
      '**/*.log',
      '**/*.cache',
      '**/coverage/**',
      '**/public/**',
      '**/*.d.ts',
      '**/*.svg',
      '**/*.sh',
      '**/auto-imports.d.ts',
      '**/components.d.ts',
      '.stylelintrc',
      '**/dist/**',
    ],
  },
];
