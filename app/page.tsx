'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { ChatContainer } from '@/components/chat-container'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <main className="flex min-h-screen flex-col">
      <Header isConnected={isConnected} />
      <ChatContainer onConnectionChange={setIsConnected} />
    </main>
  )
}
