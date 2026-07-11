import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: /\.[jt]sx?$/
    })
  ],
  preview: {
    allowedHosts: [
      'vmaiscomunicacao.com.br',
      'www.vmaiscomunicacao.com.br'
    ]
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
});
