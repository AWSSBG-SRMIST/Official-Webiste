'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../../lib/SplitText'
import './AboutSection.css'

const PILLARS = [
  { n: '01', title: 'Learn', text: 'Workshops, cert bootcamps, office hours. Ground up — no prior cloud required.' },
  { n: '02', title: 'Build', text: 'Real projects on live AWS. Deploy, break, fix, ship. Portfolios that recruiters open.' },
  { n: '03', title: 'Ship', text: 'Hackathons, demo days, community reviews. Turn half-done ideas into running systems.' },
]

const AboutSection = () => {
  const sectionRef = useRef(null)
  const paraRef = useRef(null)
  const pillarsRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(paraRef.current, { y: 40, opacity: 0 })
      gsap.set('.about-pillar', { y: 60, opacity: 0 })

      gsap.to(paraRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      })
      gsap.to('.about-pillar', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.5,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      })

      gsap.to('.about-backdrop', {
        yPercent: -20,
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
    <section className="about-section section-shell" ref={sectionRef}>
      <div className="about-backdrop" aria-hidden="true" />

      <div className="section-inner about-inner">
        <div className="about-head">
          <span className="eyebrow">01 · Who we are</span>
          <SplitText
            as="h2"
            className="display-md about-title"
            html={'A playground for students<br/>who want to actually build.'}
            types="words"
            onSplit={({ words }) => {
              gsap.set(words, { yPercent: 120, opacity: 0 })
              const tween = gsap.to(words, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.04,
                ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
              })
              return () => tween.scrollTrigger?.kill()
            }}
          />
          <p className="para about-lede" ref={paraRef}>
            AWS Cloud Clubs — SRMIST is a student-led community for builders exploring cloud,
            software, AI/ML and DevOps inside the AWS ecosystem. Hands-on workshops, real projects,
            and late-night debug sessions over chai.
          </p>
        </div>

        <div className="about-pillars" ref={pillarsRef}>
          {PILLARS.map((p) => (
            <article className="about-pillar" key={p.n}>
              <span className="about-pillar-num">{p.n}</span>
              <h3 className="about-pillar-title">{p.title}</h3>
              <p className="about-pillar-text">{p.text}</p>
              <span className="about-pillar-line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
