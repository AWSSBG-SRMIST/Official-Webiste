'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from './useChatStream'

export function MessageList({
  messages,
  pending,
}: {
  messages: ChatMessage[]
  pending: boolean
}) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, pending])

  return (
    <div className="chatbot-messages" role="log" aria-live="polite">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`chatbot-bubble chatbot-bubble--${m.role}${m.error ? ' chatbot-bubble--error' : ''}`}
        >
          {m.role === 'assistant' ? (
            !m.content && pending ? (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span className="chatbot-dot" />
                <span className="chatbot-dot" />
                <span className="chatbot-dot" />
              </div>
            ) : (
              <div className="chatbot-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            )
          ) : (
            <span>{m.content}</span>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
