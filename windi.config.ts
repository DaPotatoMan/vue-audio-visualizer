import { defineConfig } from 'windicss/helpers'
import defaultTheme from 'windicss/defaultTheme'

export default defineConfig({
  darkMode: false,
  attributify: true,

  // theme: {
  //   fontFamily: {
  //     default: ['"Source Sans Pro"', 'sans-serif', ...defaultTheme.fontFamily.sans]
  //   },

  //   extend: {
  //     textColor: {
  //       default: '#fff'
  //     },

  //     backgroundColor: {
  //       default: '#0B0A20'
  //     },

  //     screens: {
  //       xxs: '480px',
  //       xs: '580px'
  //     }
  //   }
  // },

  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center'
  }
})
