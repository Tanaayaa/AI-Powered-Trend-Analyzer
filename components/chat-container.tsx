'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { WelcomeScreen } from './welcome-screen'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

interface ChatContainerProps {
  onConnectionChange: (connected: boolean) => void
}

export function ChatContainer({ onConnectionChange }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        onConnectionChange(response.ok)
      } catch {
        onConnectionChange(false)
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [onConnectionChange])

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          sources: data.sources,
        }
        setMessages((prev) => [...prev, assistantMessage])
        onConnectionChange(true)
      } else {
        const errorData = await response.json().catch(() => null)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: errorData?.error || 'Sorry, I encountered an error while processing your request. Please try again.',
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Unable to connect to the server. Please check if the backend is running.',
      }
      setMessages((prev) => [...prev, errorMessage])
      onConnectionChange(false)
    } finally {
      setIsLoading(false)
    }
  }, [onConnectionChange])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={sendMessage} />
        ) : (
          <div className="mx-auto max-w-4xl py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                role={message.role}
                sources={message.sources}
              />
            ))}
            {isLoading && (
              <ChatMessage
                content=""
                role="assistant"
                isLoading
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="mx-auto max-w-4xl">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
