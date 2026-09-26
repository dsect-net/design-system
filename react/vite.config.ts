import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig, type Plugin } from 'vite';

const canonicalCss = ['fonts', 'tokens', 'base', 'components'] as const;

function copyCanonicalCss(): Plugin {
  return {
    name: 'copy-canonical-css',
    closeBundle() {
      const repoRoot = resolve(__dirname, '..');
      const distDir = resolve(__dirname, 'dist');

      for (const name of canonicalCss) {
        copyFileSync(resolve(repoRoot, `${name}.css`), resolve(distDir, `${name}.css`));
      }

      // The fonts travel with the package: the woff2 files fonts.css points at, and
      // the OFL licences they must ship with. They stay separate files (not inlined)
      // so each unicode-range subset still loads only when a page needs it.
      const fontsDir = resolve(distDir, 'fonts');
      mkdirSync(fontsDir, { recursive: true });
      for (const f of readdirSync(resolve(repoRoot, 'fonts'))) {
        if (f.endsWith('.woff2') || f.startsWith('OFL-')) copyFileSync(resolve(repoRoot, 'fonts', f), resolve(fontsDir, f));
      }

      // styles.css pulls the fonts in itself, so the one-line import just works.
      // @import must be the first rule in the file.
      const styles = resolve(distDir, 'dsect-ui.css');
      writeFileSync(styles, `@import "./fonts.css";\n${readFileSync(styles, 'utf8')}`);
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
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
