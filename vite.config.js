import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { glob } from 'glob'

// Trouve tous les fichiers .html dans src (récursivement)
const htmlFiles = glob.sync('src/**/*.html').reduce((acc, file) => {
  const name = file.replace(/\.html$/, '').replace(/\//g, '-')
  acc[name] = resolve(__dirname, file)
  return acc
}, {})

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...htmlFiles
      }
    }
  },
  server: {
    historyApiFallback: true
  }
})