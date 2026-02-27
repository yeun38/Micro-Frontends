import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// 전통적인 빌드 방식 - Module Federation 없이 단일 번들로 빌드
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    // 모든 코드가 하나의 번들로 합쳐짐
    rollupOptions: {
      output: {
        manualChunks: undefined, // 청크 분리 없이 단일 번들
      },
    },
  },
})
