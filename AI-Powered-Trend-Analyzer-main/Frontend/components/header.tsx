'use client'

import { TrendingUp, Activity, Zap } from 'lucide-react'

interface HeaderProps {
  isConnected: boolean
  mode?: 'demo' | 'live'
}

export function Header({ isConnected, mode = 'demo' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <TrendingUp className="h-5 w-5 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Trend Analyzer</h1>
            <p className="text-xs text-muted-foreground">Powered by LLaMA 3.2</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-secondary-foreground">Real-time Analysis</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {mode === 'live' ? 'Live' : 'Demo Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
