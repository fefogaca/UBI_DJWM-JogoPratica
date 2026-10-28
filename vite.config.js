import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        chunkSizeWarningLimit: 5000,
        rolldownOptions: {
            input: {
                menu: resolve(import.meta.dirname, 'index.html'),
                nivel1: resolve(import.meta.dirname, 'nivel1.html'),
                creditos: resolve(import.meta.dirname, 'creditos.html'),
                gameover: resolve(import.meta.dirname, 'gameover.html'),
            },
        },
    },
});
