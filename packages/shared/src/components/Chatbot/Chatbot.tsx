import { useState, useRef, useEffect, useCallback } from 'react'
import { useWebSocket, ConnectionStatus } from '../../hooks/useWebSocket'
import { Message } from '../../types'
import './Chatbot.css'

// WebSocket URL (환경변수 또는 기본값)
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! 무엇을 도와드릴까요? 🤖',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleWebSocketMessage = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data)

      if (parsed.type === 'typing') {
        setIsTyping(true)
        return
      }

      if (parsed.type === 'message') {
        setIsTyping(false)
        const botMessage: Message = {
          id: Date.now().toString(),
          content: parsed.content,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch {
      // 일반 텍스트 메시지 처리
      setIsTyping(false)
      const botMessage: Message = {
        id: Date.now().toString(),
        content: data,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }
  }, [])

  const { sendMessage, status, connect, disconnect } = useWebSocket({
    url: WS_URL,
    onMessage: handleWebSocketMessage,
    onOpen: () => {
      console.log('WebSocket 연결됨')
    },
    onClose: () => {
      console.log('WebSocket 연결 종료')
    },
  })

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: status === 'connected' ? 'sending' : 'sent',
    }

    setMessages((prev) => [...prev, userMessage])

    if (status === 'connected') {
      sendMessage(JSON.stringify({ type: 'message', content: inputValue }))
    } else {
      // WebSocket 미연결 시 로컬 응답 (데모용)
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getLocalResponse(inputValue),
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
      }, 1000)
    }

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: ConnectionStatus): string => {
    switch (status) {
      case 'connected':
        return '#4caf50'
      case 'connecting':
        return '#ff9800'
      case 'error':
        return '#f44336'
      default:
        return '#9e9e9e'
    }
  }

  const getStatusText = (status: ConnectionStatus): string => {
    switch (status) {
      case 'connected':
        return '연결됨'
      case 'connecting':
        return '연결 중...'
      case 'error':
        return '연결 오류'
      default:
        return '오프라인'
    }
  }

  return (
    <div className="chatbot">
      <header className="chatbot-header">
        <div className="chatbot-title">
          <span className="chatbot-icon">💬</span>
          <span>실시간 챗봇</span>
        </div>
        <div className="connection-status">
          <span
            className="status-dot"
            style={{ backgroundColor: getStatusColor(status) }}
          />
          <span className="status-text">{getStatusText(status)}</span>
          {status === 'disconnected' && (
            <button className="connect-btn" onClick={connect}>
              연결
            </button>
          )}
          {status === 'connected' && (
            <button className="disconnect-btn" onClick={disconnect}>
              끊기
            </button>
          )}
        </div>
      </header>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="input-field"
        />
        <button
          onClick={handleSendMessage}
          className="send-btn"
          disabled={!inputValue.trim()}
        >
          전송
        </button>
      </div>
    </div>
  )
}

// 로컬 데모 응답 (WebSocket 미연결 시)
function getLocalResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes('안녕') || lowerInput.includes('hello')) {
    return '안녕하세요! 반갑습니다 😊'
  }
  if (lowerInput.includes('도움') || lowerInput.includes('help')) {
    return '무엇을 도와드릴까요? 질문해 주세요!'
  }
  if (lowerInput.includes('시간') || lowerInput.includes('time')) {
    return `현재 시간은 ${new Date().toLocaleTimeString('ko-KR')} 입니다.`
  }
  if (lowerInput.includes('날씨') || lowerInput.includes('weather')) {
    return '죄송합니다. 날씨 정보는 아직 연동되지 않았어요 🌤️'
  }

  return `"${input}"에 대한 응답입니다. WebSocket 서버에 연결하면 실시간 AI 응답을 받을 수 있어요!`
}

export default Chatbot
