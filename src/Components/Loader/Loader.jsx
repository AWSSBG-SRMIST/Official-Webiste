'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import './Loader.css'

const Loader = () => {
  const rootRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    const obj = { n: 0 }
    const tl = gsap.timeline()
    tl.to(obj, {
      n: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.floor(obj.n)).padStart(3, '0')
      },
    }).to(
      barRef.current,
      { scaleX: 1, duration: 1.4, ease: 'power2.inOut' },
      0,
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className="loader-root" ref={rootRef}>
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-orb" aria-hidden="true" />

      <div className="loader-top">
        <span className="loader-eyebrow">AWS Cloud Clubs · SRMIST</span>
        <span className="loader-counter" ref={counterRef}>000</span>
      </div>

      <div className="loader-center">
        <Image
          src="/logo.png"
          alt="AWS Cloud Clubs SRMIST"
          width={140}
          height={140}
          priority
          className="loader-logo"
        />
        <h1 className="loader-title">
          <span>Think Big</span>
          <span className="gradient-text">Build Bigger</span>
        </h1>
      </div>

      <div className="loader-bottom">
        <div className="loader-bar">
          <div className="loader-bar-fill" ref={barRef} />
        </div>
        <span className="loader-status">Booting systems…</span>
      </div>
    </div>
  )
}

export default Loader
