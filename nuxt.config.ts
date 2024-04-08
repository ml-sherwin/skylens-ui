// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  alias: { '~ui': resolve('./') },
  devtools: { enabled: true },
  components: [
    { path: '~ui/components' }
  ],
  css: [
    '~ui/assets/css/icons.css',
    '~ui/assets/css/layout.styl',
  ],
  modules: ['@nuxtjs/tailwindcss'],
  plugins: [
    '~ui/plugins/v-calendar.ts',
  ]
})
