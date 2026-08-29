'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Mic, Send, UserRound } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { cn } from '@/lib/utils'
import { copilotConversation, copilotSuggestions } from '@/lib/mock-data'
import { sendCopilotMessage } from '@/lib/services'
import type { CopilotMessage } from '@/lib/types'

export function CopilotPanel({
  className,
  fill = false,
}: {
  className?: string
  fill?: boolean
}) {
  const [messages, setMessages] = useState<CopilotMessage[]>(copilotConversation)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const submit = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    const userMsg: CopilotMessage = {
      id: `u-${Date.now()}`,
      role: 'commander',
      content: trimmed,
      timestamp: Date.now(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)
    const reply = await sendCopilotMessage(trimmed)
    setMessages((m) => [...m, reply])
    setThinking(false)
  }

  return (
    <Panel
      title="Aegis Copilot"
      subtitle="Emergency Decision Assistant"
      icon={<Bot className="h-4 w-4 text-primary" />}
      className={className}
      bodyClassName="flex flex-col p-0"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          className={cn(
            'flex flex-col gap-3 overflow-y-auto scrollbar-thin p-3.5',
            fill ? 'flex-1' : 'max-h-72',
          )}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn('flex gap-2.5', m.role === 'commander' && 'flex-row-reverse')}
            >
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                  m.role === 'copilot'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-secondary text-secondary-foreground',
                )}
              >
                {m.role === 'copilot' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[85%] rounded-md border px-3 py-2 text-[12.5px] leading-relaxed',
                  m.role === 'copilot'
                    ? 'border-border bg-secondary/50 text-foreground'
                    : 'border-primary/30 bg-primary/10 text-foreground',
                )}
              >
                <div
                  className={cn(
                    'mb-0.5 text-[10px] font-semibold uppercase tracking-wider',
                    m.role === 'copilot' ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {m.role === 'copilot' ? 'Copilot' : 'Commander'}
                </div>
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-3 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
          {copilotSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              disabled={thinking}
              className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-center gap-2 border-t border-border p-2.5"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aegis Copilot…"
            aria-label="Ask Aegis Copilot"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50"
          />
          <button
            type="button"
            aria-label="Voice input (coming soon)"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Panel>
  )
}
