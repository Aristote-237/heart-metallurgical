import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.png'],
    workbox: { skipWaiting: true, clientsClaim: true, cleanupOutdatedCaches: true,
      navigateFallback: '/index.html',
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,webp,svg}'] },
    manifest: { name: 'Heart Metallurgical Construction — HMC SARL', short_name: 'HMC SARL',
      description: 'BTP, travaux métalliques et finitions à Yaoundé.', lang: 'fr',
      theme_color: '#0d1220', background_color: '#0d1220', display: 'standalone', start_url: '/',
      icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] }
  })]
})
