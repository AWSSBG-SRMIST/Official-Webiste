'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagnetic } from '../../lib/useMagnetic'
import './Hero.css'

const Hero = () => {
  const sectionRef = useRef(null)
  const eyebrowRef = useRef(null)
  const taglineRef = useRef(null)
  const actionsRef = useRef(null)
  const orbARef = useRef(null)
  const orbBRef = useRef(null)
  const logoRef = useRef(null)
  const scrollHintRef = useRef(null)
  const titleRef = useRef(null)
  const charsRef = useRef([])

  const btnRef = useMagnetic(0.3)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      charsRef.current = gsap.utils.toArray('.hero-word', titleRef.current)
      gsap.set(charsRef.current, { yPercent: 110, opacity: 0 })
      gsap.set(eyebrowRef.current, { opacity: 0, y: 20 })
      gsap.set(taglineRef.current, { opacity: 0, y: 30 })
      gsap.set(actionsRef.current, { opacity: 0, y: 40 })
      gsap.set(logoRef.current, { opacity: 0, scale: 0.85, rotation: -12 })

      const tl = gsap.timeline({ delay: 0.3 })
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(
          charsRef.current,
          { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.05 },
          '-=0.5',
        )
        .to(
          taglineRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.7',
        )
        .to(
          actionsRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.6',
        )
        .to(
          logoRef.current,
          { opacity: 1, scale: 1, rotation: 0, duration: 1.4, ease: 'power3.out' },
          '-=1.4',
        )

      gsap.to(orbARef.current, {
        yPercent: 40,
        xPercent: -10,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(orbBRef.current, {
        yPercent: -30,
        xPercent: 20,
        scale: 1.3,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to(logoRef.current, {
        yPercent: -35,
        rotation: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to([titleRef.current, taglineRef.current, actionsRef.current, eyebrowRef.current], {
        opacity: 0,
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '60% top',
          scrub: 1,
        },
      })

      gsap.to(scrollHintRef.current, {
        opacity: 0,
        duration: 0.3,
        scrollTrigger: {
          trigger: section,
          start: 'top -10%',
          toggleActions: 'play none none reverse',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero-section" ref={sectionRef}>
      <div className="hero-orb hero-orb-a" ref={orbARef} />
      <div className="hero-orb hero-orb-b" ref={orbBRef} />

      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow" ref={eyebrowRef}>
            <span className="hero-dot" />
            AWS Cloud Clubs · Community Program
          </div>

          <h1 className="display hero-title" ref={titleRef}>
            <div>
              <span className="hero-word" style={{ display: 'inline-block' }}>Think&nbsp;</span>
              <span className="hero-word gradient-text" style={{ display: 'inline-block' }}>Big,</span>
            </div>
            <div>
              <span className="hero-word" style={{ display: 'inline-block' }}>Build&nbsp;</span>
              <span className="hero-word gradient-text" style={{ display: 'inline-block' }}>Bigger.</span>
            </div>
          </h1>

          <p className="hero-tagline" ref={taglineRef}>
            A student-led community at SRMIST turning curiosity about the cloud into real, shipped,
            production-ready builds.
          </p>

          <div className="hero-actions" ref={actionsRef}>
            <Link href="/join" className="btn btn-solid" ref={btnRef}>
              Join the Club <FaArrowRight />
            </Link>
            <Link href="/events" className="btn">
              Explore Events
            </Link>
          </div>
        </div>

        <div className="hero-visual" ref={logoRef}>
          <div className="hero-visual-ring" />
          <div className="hero-visual-ring hero-visual-ring-2" />
          <img src="/logo-nobg.png" alt="AWS Cloud Clubs SRMIST" className="hero-logo-img" />
        </div>
      </div>

      <div className="hero-meta">
        <span>SRM Institute · Chennai</span>
        <span>EST · 2024</span>
        <span>Cohort · ACC&apos;25</span>
      </div>

      <div className="hero-scroll-hint" ref={scrollHintRef}>
        <span className="hero-scroll-label">Scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  )
}

export default Hero
