import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        chatbot: `${process.env.VITE_CHATBOT_URL || 'http://localhost:3001'}/assets/remoteEntry.js`,
        header: 'https://header-dusunax-001.web.app/remoteEntry.js',
        products: 'https://products-dusunax-001.web.app/remoteEntry.js',
        cart: 'https://cart-dusunax-001.web.app/remoteEntry.js',
        archive: 'https://archive-dusunax-001.web.app/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
