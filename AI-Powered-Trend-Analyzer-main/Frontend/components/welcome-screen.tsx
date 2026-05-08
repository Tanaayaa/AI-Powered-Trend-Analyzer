'use client'

import { TrendingUp, Hash, MessageCircle, BarChart3, Zap, Search } from 'lucide-react'

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  {
    icon: Hash,
    text: 'What are the top trending topics on social media today?',
  },
  {
    icon: BarChart3,
    text: 'Analyze sentiment around AI and technology trends',
  },
  {
    icon: MessageCircle,
    text: 'What topics are gaining momentum on social media?',
  },
  {
    icon: Search,
    text: 'Find emerging trends in the tech industry',
  },
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
        <TrendingUp className="h-10 w-10 text-background" />
      </div>

      <h2 className="mb-3 text-2xl font-semibold text-foreground text-center text-balance">
        Welcome to AI Trend Analyzer
      </h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground text-balance">
        Ask me about trending topics, social media insights, and real-time analysis of what&apos;s happening across platforms.
      </p>

      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-card-foreground">{suggestion.text}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" />
          <span>Real-time data</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span>RAG-powered insights</span>
        </div>
      </div>
    </div>
  )
}
