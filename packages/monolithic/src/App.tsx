import { useState } from 'react'
import { Chatbot } from '@mfe/shared'
import './App.css'

// 전통적인 빌드 방식: Chatbot 컴포넌트가 직접 import됨 (Module Federation 없음)
// 빌드 시점에 모든 코드가 하나의 번들로 합쳐짐
function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="shell-app">
      <header className="shell-header">
        <h1>Monolithic Application</h1>
        <p>전통적인 빌드 타임 방식 - 모든 코드가 하나의 번들로 합쳐짐</p>
        <div className="build-info">
          <span className="badge">Build Time Integration</span>
          <span className="badge">Single Bundle</span>
        </div>
      </header>

      <main className="shell-main">
        <section className="content-section">
          <h2>메인 콘텐츠 영역</h2>
          <p>
            이 앱은 <strong>전통적인 빌드 방식</strong>을 사용합니다.
            챗봇 컴포넌트가 빌드 시점에 메인 번들에 직접 포함됩니다.
          </p>
          <div className="feature-cards">
            <div className="card">
              <h3>📦 단일 번들</h3>
              <p>모든 코드가 하나의 JavaScript 파일로 번들됩니다</p>
            </div>
            <div className="card">
              <h3>🔨 빌드 타임 통합</h3>
              <p>컴포넌트가 빌드 시점에 직접 import되어 합쳐집니다</p>
            </div>
            <div className="card">
              <h3>⚡ 간단한 구조</h3>
              <p>설정이 간단하고 이해하기 쉽습니다</p>
            </div>
          </div>

          <div className="comparison-section">
            <h3>Module Federation과의 차이점</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>특성</th>
                  <th>Monolithic (현재)</th>
                  <th>Module Federation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>번들링</td>
                  <td>단일 번들</td>
                  <td>분리된 번들</td>
                </tr>
                <tr>
                  <td>로딩 시점</td>
                  <td>빌드 타임</td>
                  <td>런타임</td>
                </tr>
                <tr>
                  <td>독립 배포</td>
                  <td>불가능</td>
                  <td>가능</td>
                </tr>
                <tr>
                  <td>초기 로딩</td>
                  <td>전체 로드</td>
                  <td>필요 시 로드</td>
                </tr>
                <tr>
                  <td>복잡도</td>
                  <td>낮음</td>
                  <td>높음</td>
                </tr>
              </tbody>
            </table>
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

      {/* 챗봇 컨테이너 - Module Federation 없이 직접 렌더링 */}
      {isChatOpen && (
        <div className="chatbot-container">
          {/* Suspense/lazy 없이 직접 렌더링 - 이미 번들에 포함됨 */}
          <Chatbot />
        </div>
      )}
    </div>
  )
}

export default App
