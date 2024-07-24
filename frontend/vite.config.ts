// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//   },
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Vite will create this directory
    rollupOptions: {
      input: './index.html',  // Specify the entry point
    },
  },
  server: {
    port: 3000,
  },
});
