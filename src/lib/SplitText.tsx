'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import SplitType from 'split-type'

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'

export type SplitParts = {
  chars: HTMLElement[]
  words: HTMLElement[]
  lines: HTMLElement[]
  el: HTMLElement
}

type Props = {
  as?: Tag
  className?: string
  html: string
  types?: 'words' | 'chars' | 'words,chars' | 'lines'
  onSplit?: (parts: SplitParts) => (() => void) | void
}

const SplitText = forwardRef<HTMLElement, Props>(function SplitText(
  { as = 'h2', className, html, types = 'words,chars', onSplit },
  ref,
) {
  const localRef = useRef<HTMLElement>(null)
  useImperativeHandle(ref, () => localRef.current as HTMLElement)

  useEffect(() => {
    const el = localRef.current
    if (!el) return

    let split: SplitType | null = null
    let userCleanup: (() => void) | void
    let isCancelled = false

    let timeoutId: NodeJS.Timeout
    document.fonts.ready.then(() => {
      timeoutId = setTimeout(() => {
        if (isCancelled) return
        try {
          split = new SplitType(el, { types })
          userCleanup = onSplit?.({
            chars: (split.chars as HTMLElement[]) ?? [],
            words: (split.words as HTMLElement[]) ?? [],
            lines: (split.lines as HTMLElement[]) ?? [],
            el,
          })
        } catch {
          /* noop */
        }
      }, 100)
    })

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
      try { userCleanup?.() } catch { /* noop */ }
    }
  }, [html, types])

  const Tag = as as 'h1'
  return <Tag ref={localRef as React.RefObject<HTMLHeadingElement>} className={className} dangerouslySetInnerHTML={{ __html: html }} />
})

export default SplitText
