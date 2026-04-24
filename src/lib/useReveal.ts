'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

type Options = {
  delay?: number
  stagger?: number
  y?: number
  duration?: number
  start?: string
  splitBy?: 'words' | 'lines' | 'chars'
}

export function useReveal<T extends HTMLElement>(opts: Options = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const splitBy = opts.splitBy ?? 'words'
    const split = new SplitType(el, { types: splitBy })
    const targets =
      splitBy === 'words'
        ? split.words ?? []
        : splitBy === 'lines'
        ? split.lines ?? []
        : split.chars ?? []

    gsap.set(targets, { yPercent: 110, opacity: 0 })

    const tween = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      duration: opts.duration ?? 0.9,
      ease: 'power3.out',
      stagger: opts.stagger ?? 0.04,
      delay: opts.delay ?? 0,
      scrollTrigger: {
        trigger: el,
        start: opts.start ?? 'top 85%',
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      split.revert()
    }
  }, [opts.delay, opts.stagger, opts.y, opts.duration, opts.start, opts.splitBy])

  return ref
}

export function useFadeUp<T extends HTMLElement>(opts: Omit<Options, 'splitBy'> = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tween = gsap.fromTo(
      el,
      { y: opts.y ?? 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: opts.duration ?? 1.1,
        ease: 'power3.out',
        delay: opts.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? 'top 85%',
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [opts.delay, opts.y, opts.duration, opts.start])

  return ref
}
