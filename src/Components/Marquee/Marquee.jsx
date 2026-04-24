'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Marquee.css'

const DEFAULT_ITEMS = [
  'Think Big',
  'Build Bigger',
  'AWS Cloud Clubs',
  'SRMIST · KTR',
  'Est 2024',
]

const Marquee = ({ items = DEFAULT_ITEMS, reverse = false }) => {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      )
    })

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [reverse])

  const all = [...items, ...items, ...items]

  return (
    <div className="mq">
      <div className="mq-track" ref={trackRef}>
        {all.map((item, i) => (
          <span className="mq-item" key={i}>
            <span className="mq-text">{item}</span>
            <span className="mq-star" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
