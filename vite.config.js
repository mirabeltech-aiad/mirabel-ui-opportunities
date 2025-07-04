import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/ui60/', // required for production to work from sub-path
  plugins: [react()],
  server: {
    port: 3000,
    historyApiFallback: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true
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
  build: {
    rollupOptions: {
      external: [], // Ensure React is not externalized
      output: {
        // Manual chunk splitting
        manualChunks: (id) => {
          // Vendor chunks - Third party libraries
          if (id.includes('node_modules')) {
            // Bundle React and ReactDOM together to prevent createContext issues
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'vendor-forms';
            }
            if (id.includes('axios') || id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
          
          // Feature chunks - Your application code
          if (id.includes('src/features/Opportunity')) {
            if (id.includes('proposals')) {
              return 'proposals';
            }
            if (id.includes('reports')) {
              return 'reports';
            }
            return 'opportunity';
          }
          
          if (id.includes('src/features/reports')) {
            return 'reports';
          }
          
          if (id.includes('src/hooks/components/Reports')) {
            return 'reports';
          }
        },
        
        // File naming with hash for cache busting
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Build optimizations
    target: 'es2015',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
  }
});
