import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/ui60/', // required for production to work from sub-path
  plugins: [react()],
  server: {
    port: 3000,
    historyApiFallback: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma',
      'Access-Control-Allow-Credentials': 'true',
    },
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
