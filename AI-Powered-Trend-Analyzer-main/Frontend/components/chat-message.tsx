'use client'

import { cn } from '@/lib/utils'
import { User, Sparkles, ExternalLink } from 'lucide-react'

interface ChatMessageProps {
  content: string
  role: 'user' | 'assistant'
  sources?: string[]
  isLoading?: boolean
}

export function ChatMessage({ content, role, sources, isLoading }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-4 p-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </div>

      <div className={cn('flex max-w-[75%] flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-card text-card-foreground rounded-bl-md border border-border'
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-current animate-pulse delay-150" />
              <div className="h-2 w-2 rounded-full bg-current animate-pulse delay-300" />
              <span className="text-sm text-muted-foreground ml-2">Analyzing trends...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
        </div>

        {sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            <span className="text-xs text-muted-foreground">Sources:</span>
            {sources.map((source, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
              >
                <ExternalLink className="h-3 w-3" />
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
