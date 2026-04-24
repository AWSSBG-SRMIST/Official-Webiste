'use client'

import { useCallback, useRef, useState } from 'react'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

const genId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export function useChatStream(apiBase: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pending, setPending] = useState(false)
  const sessionRef = useRef<string>(genId())
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    sessionRef.current = genId()
    setMessages([])
    setPending(false)
  }, [])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || pending) return

      const userMsg: ChatMessage = { id: genId(), role: 'user', content: trimmed }
      const botId = genId()
      setMessages((m) => [...m, userMsg, { id: botId, role: 'assistant', content: '' }])
      setPending(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(`${apiBase}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, session_id: sessionRef.current }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const body = await res.json().catch(() => null)
          const msg =
            body?.message ||
            (res.status === 429
              ? "You've hit the hourly limit — try again in a bit!"
              : 'Something went wrong. Try again.')
          setMessages((m) =>
            m.map((x) => (x.id === botId ? { ...x, content: msg, error: true } : x)),
          )
          setPending(false)
          return
        }

        const reader = res.body?.getReader()
        if (!reader) {
          setPending(false)
          return
        }
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n\n')
          buffer = parts.pop() || ''
          for (const part of parts) {
            const line = part.trim()
            if (!line.startsWith('data:')) continue
            const json = line.slice(5).trim()
            if (!json) continue
            try {
              const evt = JSON.parse(json) as
                | { type: 'token'; content: string }
                | { type: 'error'; message: string }
                | { type: 'done' }
              if (evt.type === 'token') {
                setMessages((m) =>
                  m.map((x) =>
                    x.id === botId ? { ...x, content: x.content + evt.content } : x,
                  ),
                )
              } else if (evt.type === 'error') {
                setMessages((m) =>
                  m.map((x) =>
                    x.id === botId ? { ...x, content: evt.message, error: true } : x,
                  ),
                )
              }
            } catch {
              /* ignore parse errors */
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setMessages((m) =>
            m.map((x) =>
              x.id === botId
                ? { ...x, content: 'Connection failed. Is the chatbot server running?', error: true }
                : x,
            ),
          )
        }
      } finally {
        setPending(false)
      }
    },
    [apiBase, pending],
  )

  return { messages, pending, send, reset }
}
