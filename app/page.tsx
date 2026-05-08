'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/header'
import { ChatContainer } from '@/components/chat-container'

export default function Home() {
  const [isConnected, setIsConnected] = useState(true)
  const [mode, setMode] = useState<'demo' | 'live'>('demo')

  const handleConnectionChange = useCallback((connected: boolean, newMode: 'demo' | 'live') => {
    setIsConnected(connected)
    setMode(newMode)
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      <Header isConnected={isConnected} mode={mode} />
      <ChatContainer onConnectionChange={handleConnectionChange} />
    </main>
  )
}
