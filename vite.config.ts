import path from 'path';

import eslint from '@nabla/vite-plugin-eslint';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
import imagemin from 'vite-plugin-imagemin';

const pagesBase = process.env.GITHUB_PAGES_BASE?.replace(/\/$/, '');

export default defineConfig({
  base: pagesBase ? `${pagesBase}/` : '/',
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
        }),
      ],
    }),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    imagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
    eslint({
      eslintOptions: {
        fix: true,
        cache: false,
      },
    }),
  ],
  optimizeDeps: {
    include: ['tdesign-vue-next', 'tvision-color', 'lodash-es', 'vue', 'vue-router', 'pinia'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name]-[hash].js',
        chunkFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        compact: true,
        manualChunks: {
          tdesign: ['tdesign-vue-next', 'tdesign-icons-vue-next'],
          vue: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
          lodash: ['lodash-es'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
    warmup: {
      clientFiles: ['./index.html', './src/{views,components}/*'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
