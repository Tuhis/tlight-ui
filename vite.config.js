import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src'),
        },
    },
    esbuild: {
        loader: "jsx",
        include: /src\/.*\.js$/,
        exclude: [],
    },
    server: {
        port: 3000,
        open: true,
        host: true,
    },
    css: {
        devSourcemap: true,
    },
    build: {
        outDir: 'build',
        sourcemap: true,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        css: true,
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e/**'],
    },
});
