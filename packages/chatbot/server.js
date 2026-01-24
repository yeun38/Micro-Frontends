// WebSocket 서버 + Google Gemini API 연동
// 실행: node server.js

import { WebSocketServer } from 'ws'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

// Gemini API 설정
const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY가 설정되지 않았습니다.')
  console.error('📝 .env 파일에 GEMINI_API_KEY=your_api_key 를 추가해주세요.')
  console.error('🔗 API 키 발급: https://aistudio.google.com/app/apikey')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// 대화 히스토리 저장 (클라이언트별)
const chatSessions = new Map()

const wss = new WebSocketServer({ port: 8080 })

console.log('🚀 WebSocket 서버가 ws://localhost:8080 에서 시작되었습니다')
console.log('🤖 Google Gemini API 연결됨')

wss.on('connection', (ws) => {
  console.log('✅ 클라이언트 연결됨')

  // 새 클라이언트를 위한 채팅 세션 생성
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  })
  chatSessions.set(ws, chat)

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString())
      console.log('📩 받은 메시지:', message)

      if (message.type === 'message') {
        // 타이핑 인디케이터 전송
        ws.send(JSON.stringify({ type: 'typing' }))

        try {
          // Gemini API 호출
          const chat = chatSessions.get(ws)
          const result = await chat.sendMessage(message.content)
          const response = result.response.text()

          ws.send(JSON.stringify({ type: 'message', content: response }))
        } catch (apiError) {
          console.error('Gemini API 오류:', apiError.message)
          ws.send(
            JSON.stringify({
              type: 'message',
              content: '죄송합니다. AI 응답을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            })
          )
        }
      }
    } catch (error) {
      console.error('메시지 파싱 오류:', error)
    }
  })

  ws.on('close', () => {
    console.log('❌ 클라이언트 연결 종료')
    chatSessions.delete(ws)
  })

  // 연결 환영 메시지
  ws.send(
    JSON.stringify({
      type: 'message',
      content: 'AI 챗봇에 연결되었습니다! Google Gemini가 답변해 드립니다 🤖',
    })
  )
})
