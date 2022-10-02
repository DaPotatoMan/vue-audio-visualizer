/// <reference types="vite/client" />
/// <reference types="vue/macros" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
