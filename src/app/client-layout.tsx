'use client'

import { useEffect, useState } from 'react'
import Cursor from '../Components/Cursor/Cursor'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(window.matchMedia('(min-width: 768px)').matches)
  }, [])

  return (
    <>
      {isDesktop && <Cursor />}
      {children}
    </>
  )
}
