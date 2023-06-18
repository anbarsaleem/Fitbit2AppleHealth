import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  build: {
    outDir: 'dist', // Specify the output directory for the built files
    assetsDir: '', // Specify the directory for static assets (such as images, fonts, etc.)
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, '/index.html'), // Specify the path to your index.html file
      },
    },
  },
})
