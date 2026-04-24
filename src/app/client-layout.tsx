'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cursor from '../Components/Cursor/Cursor'
import SmoothScroll from '../lib/SmoothScroll'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDesktop, setIsDesktop] = useState(false)
  const pathname = usePathname()
  const prevPath = useRef(pathname)

  useEffect(() => {
    setIsDesktop(window.matchMedia('(min-width: 768px) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    const lenis = window.__lenis
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo(0, 0)
    }

    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <>
      <SmoothScroll />
      {isDesktop && <Cursor />}
      <main>{children}</main>
    </>
  )
}
