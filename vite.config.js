import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/postcss'
import path from 'path'

export default defineConfig({
  base: '/modern/', // required for production to work from sub-path
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    historyApiFallback: true,
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
