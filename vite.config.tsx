import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Necessary for Docker container mapping
    port: 3001, // Changed to match your localhost port
    strictPort: true,
    proxy: {
      // Proxy API requests to the backend container
      '/api': {
        target: 'http://backend:5000', // The service name from docker-compose.yml
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before forwarding
      },
      // Proxy upload requests
       '/uploads': {
        target: 'http://backend:5000',
        changeOrigin: true,
      }
    },
     hmr: {
       clientPort: 3001 // Changed to match your localhost port
     }
  },
  preview: {
    port: 3001, // Changed to match your localhost port
    host: true
  }
});

