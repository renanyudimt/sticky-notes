import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';
import './index.css';

// react-scan: dev-only rerender overlay. The `import.meta.env.DEV` guard is
// statically false in production builds, so Rollup dead-code-eliminates the
// whole branch — react-scan never ships to prod.
if (import.meta.env.DEV) {
  void import('react-scan').then(({ scan }) => scan({ enabled: true }));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
