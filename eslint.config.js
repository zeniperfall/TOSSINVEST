// ESLint flat config (v9+). Keep dependency-free so it works without npm install.
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  localStorage: 'readonly',
  fetch: 'readonly',
  URLSearchParams: 'readonly',
  Intl: 'readonly',
  getComputedStyle: 'readonly',
  PerformanceObserver: 'readonly',
  performance: 'readonly',
  Notification: 'readonly',
};

const swGlobals = {
  self: 'readonly',
  caches: 'readonly',
  fetch: 'readonly',
  URL: 'readonly',
  Promise: 'readonly',
};

const nodeGlobals = {
  process: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
};

export default [
  {
    ignores: ['node_modules/**', '_site/**', 'package-lock.json'],
  },
  {
    files: ['assets/**/*.js', 'script.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    files: ['service-worker.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: swGlobals,
    },
    rules: {
      'no-undef': 'error',
    },
  },
  {
    files: ['tests/**/*.mjs', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...nodeGlobals, ...browserGlobals },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
