// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// Utilities
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        /** handle vuejs configurations */
        vue({
            template: { transformAssetUrls }
        }),
        /** add vuetify ui framework into project */
        vuetify({
            autoImport: true
        }),
    ]
})