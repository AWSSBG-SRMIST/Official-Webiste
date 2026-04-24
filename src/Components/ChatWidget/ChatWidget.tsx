'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageList } from './MessageList'
import { SuggestedQuestions } from './SuggestedQuestions'
import { useChatStream } from './useChatStream'
import './ChatWidget.css'

const API_BASE =
  process.env.NEXT_PUBLIC_CHATBOT_API_BASE || 'http://localhost:3001'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { messages, pending, send, reset } = useChatStream(API_BASE)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const submit = (text?: string) => {
    const value = (text ?? draft).trim()
    if (!value) return
    void send(value)
    setDraft('')
  }

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <>
      <button
        className={`chatbot-bubble-btn${open ? ' chatbot-bubble-btn--open' : ''}`}
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="AWS Cloud Clubs assistant">
          <header className="chatbot-header">
            <div className="chatbot-header__title">
              <span className="chatbot-header__dot" />
              <div>
                <strong>AWSCC SRMIST Assistant</strong>
                <small>Club info · AWS questions</small>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-header__reset"
              onClick={reset}
              title="New conversation"
            >
              New chat
            </button>
          </header>

          {messages.length === 0 ? (
            <div className="chatbot-welcome">
              <p>
                Hey! I can answer questions about AWS Cloud Clubs SRMIST — events, team, how to join
                — and anything about AWS services. Try one of these:
              </p>
              <SuggestedQuestions onPick={(q) => submit(q)} />
            </div>
          ) : (
            <MessageList messages={messages} pending={pending} />
          )}

          <form
            className="chatbot-input"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about events or AWS…"
              rows={1}
              maxLength={1500}
              disabled={pending}
              aria-label="Message"
            />
            <button
              type="submit"
              className="chatbot-send"
              disabled={pending || !draft.trim()}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </form>

          <footer className="chatbot-footer">
            Conversations are logged to improve this assistant. Please don&apos;t share sensitive
            info.
          </footer>
        </div>
      )}
    </>
  )
}
