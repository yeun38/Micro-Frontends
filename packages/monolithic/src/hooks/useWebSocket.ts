import { useEffect, useRef, useCallback, useState } from 'react'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface UseWebSocketOptions {
  url: string
  onMessage?: (data: string) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

interface UseWebSocketReturn {
  sendMessage: (message: string) => void
  status: ConnectionStatus
  connect: () => void
  disconnect: () => void
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectAttempts = 3,
  reconnectInterval = 3000,
}: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setStatus('connecting')

    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        setStatus('connected')
        reconnectCountRef.current = 0
        onOpen?.()
      }

      ws.onmessage = (event) => {
        onMessage?.(event.data)
      }

      ws.onclose = () => {
        setStatus('disconnected')
        onClose?.()

        // 자동 재연결 시도
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current += 1
          setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (error) => {
        setStatus('error')
        onError?.(error)
      }

      wsRef.current = ws
    } catch (error) {
      setStatus('error')
      console.error('WebSocket 연결 실패:', error)
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    reconnectCountRef.current = reconnectAttempts // 재연결 방지
    wsRef.current?.close()
    wsRef.current = null
    setStatus('disconnected')
  }, [reconnectAttempts])

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
    } else {
      console.warn('WebSocket이 연결되지 않았습니다.')
    }
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    sendMessage,
    status,
    connect,
    disconnect,
  }
}
