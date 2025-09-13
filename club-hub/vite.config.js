import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],

  // keep vite’s cache in node_modules for fast FS access
  cacheDir: 'node_modules/.vite',

  // help vite prebundle known-big ESM deps, and avoid prebundling tricky ones
  optimizeDeps: {
    include: ['react', 'react-dom'],
    // add heavy libs you actually use (examples):
    // include: ['react', 'react-dom', 'lodash-es', 'date-fns', 'zustand'],
    exclude: ['monaco-editor', 'mapbox-gl', 'firebase', 'aws-sdk'],
  },

  // speed up file watching / reduce CPU load
  server: {
    port: 3000,
    fs: { strict: true },
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
    // if HMR overlay is noisy/slows you down during flurries of errors:
    hmr: { overlay: true },
  },

  // make transforms a bit snappier in dev
  esbuild: {
    // keep target modern; dev doesn’t need legacy transpile
    target: 'es2020',
  },

  // prevent duplicate React if you have monorepo/linked deps
  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  // if you import some CJS-only packages in dev, this avoids slow heuristics
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
