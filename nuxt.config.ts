// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  alias: { '~ui': currentDir, 'images': fileURLToPath(new URL('./assets/images', import.meta.url)) },
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
