import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { aliases } from './vite.aliases'

export default defineConfig({
  base: '/ui60/', // required for production to work from sub-path
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: aliases,
  },
})