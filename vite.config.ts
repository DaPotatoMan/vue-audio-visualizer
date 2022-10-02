import { resolve } from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    windicss(),
    dts()
  ],

  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/app/index.ts'),
      name: 'VueAudioPlayer',
      fileName: 'app'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' }
      }
    }
  }
})
