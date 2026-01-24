import { Suspense, lazy, useState } from 'react'
import './App.css'

// Module Federation으로 Chatbot 리모트 앱 로드
const RemoteChatbot = lazy(() => import('chatbot/Chatbot'))

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="shell-app">
      <header className="shell-header">
        <h1>🏠 Main Application (Shell)</h1>
        <p>이것은 마이크로프론트엔드 호스트 앱입니다</p>
      </header>

      <main className="shell-main">
        <section className="content-section">
          <h2>메인 콘텐츠 영역</h2>
          <p>
            여기에 메인 애플리케이션의 콘텐츠가 들어갑니다.
            오른쪽 하단의 채팅 버튼을 클릭하면 챗봇 모듈이 로드됩니다.
          </p>
          <div className="feature-cards">
            <div className="card">
              <h3>📦 Module Federation</h3>
              <p>런타임에 원격 모듈을 동적으로 로드합니다</p>
            </div>
            <div className="card">
              <h3>🔌 독립 배포</h3>
              <p>각 모듈은 독립적으로 개발 및 배포 가능합니다</p>
            </div>
            <div className="card">
              <h3>🔗 공유 의존성</h3>
              <p>React 등 공통 라이브러리를 공유합니다</p>
            </div>
          </div>
        </section>
      </main>

      {/* 챗봇 토글 버튼 */}
      <button
        className="chat-toggle-btn"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label={isChatOpen ? '채팅 닫기' : '채팅 열기'}
      >
        {isChatOpen ? '✕' : '💬'}
      </button>

      {/* 챗봇 컨테이너 */}
      {isChatOpen && (
        <div className="chatbot-container">
          <Suspense fallback={<div className="chatbot-loading">챗봇 로딩 중...</div>}>
            <RemoteChatbot />
          </Suspense>
        </div>
      )}
    </div>
  )
}

export default App
