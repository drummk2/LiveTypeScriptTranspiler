import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    base: '/LiveTypeScriptTranspiler/',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
});
