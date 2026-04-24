'use client'

import { useEffect, useRef } from 'react'
import { FaHandshake, FaLightbulb, FaArrowRight } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../../lib/SplitText'
import './ContributeSection.css'

const ways = [
  {
    num: '01',
    icon: <FaHandshake />,
    title: 'Sponsor Us',
    desc: 'Partner with AWSCC — SRMIST to fund events, workshops and project resources. Visibility with 1000+ students across the SRM network.',
    cta: 'Start a Conversation',
    link: 'mailto:sponsorship.awscc.srmist@gmail.com?subject=Sponsorship Inquiry',
  },
  {
    num: '02',
    icon: <FaLightbulb />,
    title: 'Propose an Event',
    desc: 'Workshop, talk, hackathon, study jam — bring your expertise to the community. We will handle the venue, the swag, and the crowd.',
    cta: 'Suggest an Event',
    link: 'mailto:awscc.srmist@gmail.com?subject=Event Proposal',
  },
]

const ContributeSection = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.contribute-card', {
        opacity: 0,
        y: 80,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contribute-grid', start: 'top 80%' },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="contribute-section section-shell" ref={sectionRef}>
      <div className="section-inner">
        <div className="contribute-head">
          <span className="eyebrow">03 · Work with us</span>
          <SplitText
            as="h2"
            className="display-md contribute-title"
            html={'Sponsor, collaborate,<br/>or bring an idea.'}
            types="words"
            onSplit={({ words }) => {
              gsap.set(words, { yPercent: 120, opacity: 0 })
              const tween = gsap.to(words, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.05,
                ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
              })
              return () => tween.scrollTrigger?.kill()
            }}
          />
        </div>

        <div className="contribute-grid">
          {ways.map((w) => (
            <a href={w.link} className="contribute-card" key={w.num}>
              <div className="contribute-card-head">
                <span className="contribute-num">{w.num}</span>
                <span className="contribute-icon">{w.icon}</span>
              </div>
              <h3 className="contribute-card-title">{w.title}</h3>
              <p className="contribute-desc">{w.desc}</p>
              <span className="contribute-cta">
                {w.cta} <FaArrowRight />
              </span>
              <span className="contribute-glow" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContributeSection
