'use client'

const DEFAULT_CHIPS = [
  "What's the next event?",
  'What is AWS Lambda?',
  'How do I join the club?',
]

export function SuggestedQuestions({
  onPick,
  chips = DEFAULT_CHIPS,
}: {
  onPick: (q: string) => void
  chips?: string[]
}) {
  return (
    <div className="chatbot-chips" aria-label="Suggested questions">
      {chips.map((c) => (
        <button key={c} type="button" className="chatbot-chip" onClick={() => onPick(c)}>
          {c}
        </button>
      ))}
    </div>
  )
}
