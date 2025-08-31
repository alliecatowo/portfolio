import type { DefineComponent } from 'vue'

declare module '@nuxt/image/dist/runtime/components/NuxtImg.vue' {
  interface NuxtImgProps {
    src: string
    alt?: string
    width?: number | string
    height?: number | string
    sizes?: string
    loading?: 'lazy' | 'eager'
    preset?: string
    provider?: string
    quality?: number | string
    format?: string
    fit?: string
    modifiers?: Record<string, string | number | boolean>
    placeholder?: string | boolean
    placeholderClass?: string
    [key: string]: unknown
  }
  const component: DefineComponent<NuxtImgProps>
  export default component
}

declare module '@nuxt/image/dist/runtime/components/NuxtPicture.vue' {
  interface NuxtPictureProps {
    src: string
    alt?: string
    width?: number | string
    height?: number | string
    sizes?: string
    loading?: 'lazy' | 'eager'
    preset?: string
    provider?: string
    quality?: number | string
    format?: string
    fit?: string
    modifiers?: Record<string, string | number | boolean>
    imgAttrs?: Record<string, string | number | boolean>
    placeholder?: string | boolean
    placeholderClass?: string
    [key: string]: unknown
  }
  const component: DefineComponent<NuxtPictureProps>
  export default component
}

// Also cover the relative import paths used by .nuxt/components.d.ts
declare module '../../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue' {
  export { default } from '@nuxt/image/dist/runtime/components/NuxtImg.vue'
}

declare module '../../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue' {
  export { default } from '@nuxt/image/dist/runtime/components/NuxtPicture.vue'
}
