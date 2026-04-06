import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'docs', // build output will go into /docs
    rollupOptions: {
      input: {
        main: './index.html',
        hobbies: './public/Pages/hobbies.html'
      }
    }
  },
});