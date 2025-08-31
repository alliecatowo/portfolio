declare module '@nuxt/image/dist/runtime/components/NuxtImg.vue' {
  const component: any
  export default component
}

declare module '@nuxt/image/dist/runtime/components/NuxtPicture.vue' {
  const component: any
  export default component
}

// Also cover the relative import paths used by .nuxt/components.d.ts
declare module '../../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue' {
  const component: any
  export default component
}

declare module '../../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue' {
  const component: any
  export default component
}
