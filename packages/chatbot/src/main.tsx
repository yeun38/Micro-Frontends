import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Chatbot from './Chatbot'
import './index.css'

// 독립 실행 모드 (개발용)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{
      width: '380px',
      height: '500px',
      margin: '2rem auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      <Chatbot />
    </div>
  </StrictMode>,
)
