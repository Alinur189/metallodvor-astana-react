import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Не проверяем сборки, зависимости и вспомогательные окружения
  {
    ignores: ['dist', 'dist-server', 'node_modules', 'search-api'],
  },

  js.configs.recommended,

  // Node-скрипты сборки (.mjs) — среда Node, без браузерных глобалов
  {
    files: ['scripts/**', '**/*.mjs', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: '18.2' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // В этом проекте JSX не требует импорта React (new JSX transform)
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Кавычки/апострофы в русском тексте JSX — валидный HTML, не считаем ошибкой
      'react/no-unescaped-entities': 'off',

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Ловим случайно оставленные переменные, но не ругаемся на _-заглушки
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
    },
  },
];
