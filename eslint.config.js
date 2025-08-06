import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      js,
      react: pluginReact,
      prettier: pluginPrettier, // Prettier 플러그인 등록
    },
    extends: [
      js.configs.recommended, // JS 추천 규칙
      pluginReact.configs.flat.recommended, // React 추천 규칙
    ],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // React 17+ JSX Transform 대응
      'prettier/prettier': 'error', // Prettier 포맷 강제
    },
  },
]);
