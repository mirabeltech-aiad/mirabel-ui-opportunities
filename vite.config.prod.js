import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/', // Deploy to root for Amplify
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@OpportunityUtils': path.resolve(__dirname, 'src/features/Opportunity/utils'),
      '@OpportunityConstants': path.resolve(__dirname, 'src/features/Opportunity/constants'),
      '@OpportunityContexts': path.resolve(__dirname, 'src/features/Opportunity/contexts'),
      '@OpportunityComponents': path.resolve(__dirname, 'src/features/Opportunity/components'),
      '@OpportunityServices': path.resolve(__dirname, 'src/features/Opportunity/services'),
      '@OpportunityData': path.resolve(__dirname, 'src/features/Opportunity/data'),
    },
  },
});