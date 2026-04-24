'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../../lib/SplitText'
import { useMagnetic } from '../../lib/useMagnetic'
import './CtaSection.css'

const CtaSection = () => {
  const sectionRef = useRef(null)
  const orbRef = useRef(null)
  const btnRef = useMagnetic(0.28)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.cta-badge', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' },
      })
      gsap.from(['.cta-desc', '.cta-actions'], {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      })

      gsap.to(orbRef.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="cta-section section-shell" ref={sectionRef}>
      <div className="cta-orb" ref={orbRef} aria-hidden="true" />
      <div className="cta-ring" aria-hidden="true" />

      <div className="section-inner cta-inner">
        <span className="cta-badge">
          <span className="cta-badge-dot" /> Recruitment · Open Now
        </span>
        <SplitText
          as="h2"
          className="display cta-title"
          html={'Ready to dive<br/>into the cloud?'}
          types="chars"
          onSplit={({ chars }) => {
            gsap.set(chars, { yPercent: 120, opacity: 0 })
            const tween = gsap.to(chars, {
              yPercent: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.02,
              ease: 'power4.out',
              scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
            })
            return () => tween.scrollTrigger?.kill()
          }}
        />
        <p className="cta-desc">
          Membership is free for all SRM students. Come build, break things, and ship real systems.
        </p>
        <div className="cta-actions">
          <Link href="/join" className="btn btn-solid cta-btn" ref={btnRef}>
            Join Now <FaArrowRight />
          </Link>
          <a
            href="https://www.meetup.com/aws-cloud-club-srm/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Find us on Meetup
          </a>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
