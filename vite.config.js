import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Weather Now',
        short_name: 'WeatherNow',
        description: 'A beautiful weather forecast app built with React and Vite.',
        theme_color: '#00c6ff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/weather-icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/weather-icon-Copy.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
