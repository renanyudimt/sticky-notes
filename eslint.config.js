import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // flat.recommended registers the plugin + rules-of-hooks/exhaustive-deps.
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // React Compiler rules used as *static lint analysis* only — the build is
      // NOT transformed, memoization stays manual. These flag where memo is
      // missing/useless and where code breaks the Rules of React (the same
      // checks the compiler runs before it bails out on a component).
      // `recommended-latest` ships in legacy format and can't be spread into a
      // flat `extends`, so the rules are enabled explicitly here.
      'react-hooks/static-components': 'error',
      'react-hooks/use-memo': 'error',
      'react-hooks/preserve-manual-memoization': 'error',
      'react-hooks/incompatible-library': 'warn',
      'react-hooks/immutability': 'error',
      'react-hooks/globals': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/error-boundaries': 'error',
      'react-hooks/purity': 'error',
    },
  },
  {
    // shadcn/ui primitives follow their own conventions (component + variants
    // exported together); they are treated as third-party UI.
    files: ['src/modules/shared/components/ui/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
