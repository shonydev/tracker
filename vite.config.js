import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite alojar la app en cualquier carpeta o subdominio
export default defineConfig({
  base: './',
  plugins: [react()],
})
