import { copyFileSync } from 'fs';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig, type Plugin } from 'vite';

const canonicalCss = ['tokens', 'base', 'components'] as const;

function copyCanonicalCss(): Plugin {
  return {
    name: 'copy-canonical-css',
    closeBundle() {
      const repoRoot = resolve(__dirname, '..');
      const distDir = resolve(__dirname, 'dist');

      for (const name of canonicalCss) {
        copyFileSync(resolve(repoRoot, `${name}.css`), resolve(distDir, `${name}.css`));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), dts({ include: ['src'] }), copyCanonicalCss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DsectUI',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'dsect-ui.js' : 'dsect-ui.umd.cjs'),
      cssFileName: 'dsect-ui',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
      },
    },
  },
});
