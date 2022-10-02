import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: false,
  attributify: true,

  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center'
  }
})
