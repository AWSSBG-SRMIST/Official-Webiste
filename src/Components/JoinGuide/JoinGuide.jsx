'use client'

import { useEffect, useRef } from 'react'
import { FaCode, FaBullhorn, FaPalette } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './JoinGuide.css'

const domains = [
  {
    num: '01',
    icon: <FaCode />,
    category: 'Tech',
    desc: 'Build and ship production systems on AWS. Code, review, and deploy.',
    roles: ['Development', 'AI / ML', 'Cloud & DevOps'],
  },
  {
    num: '02',
    icon: <FaBullhorn />,
    category: 'Corporate',
    desc: 'Run events, manage partners, land sponsors, keep the org running.',
    roles: ['Events', 'Public Relations', 'Sponsorship', 'HR & Admin'],
  },
  {
    num: '03',
    icon: <FaPalette />,
    category: 'Creatives',
    desc: 'Shape the brand, craft the feed, design the interfaces people remember.',
    roles: ['Digital Design', 'Media', 'UI / UX'],
  },
]

const JoinGuide = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const joinWords = gsap.utils.toArray('.join-word', section)
      gsap.set(joinWords, { yPercent: 120, opacity: 0 })

      gsap.from(['.join-sub', '.join-status'], {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' },
      })
      gsap.to(joinWords, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.05,
        ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      })
      gsap.from('.join-domain-card', {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.join-domains-grid', start: 'top 85%' },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="join-section section-shell" ref={sectionRef}>
      <div className="section-inner">
        <div className="join-head">
          <span className="join-status">
            <span className="join-status-dot" />
            Recruitment · Opening soon
          </span>
          <h1 className="display join-title">
            <div>
              <span className="join-word" style={{ display: 'inline-block' }}>Join&nbsp;</span>
              <span className="join-word" style={{ display: 'inline-block' }}>the&nbsp;</span>
              <span className="join-word gradient-text" style={{ display: 'inline-block' }}>Club.</span>
            </div>
          </h1>
          <p className="join-sub">
            Applications open in a few weeks. Pick a domain, pass the cert gate, submit — we review
            rolling.
          </p>
        </div>

        <div className="join-domains">
          <div className="join-domains-head">
            <span className="eyebrow">The three doors</span>
            <p className="para join-domains-sub">Every member belongs to one of three domains.</p>
          </div>

          <div className="join-domains-grid">
            {domains.map((d) => (
              <article className="join-domain-card" key={d.num}>
                <div className="join-domain-head">
                  <span className="join-domain-num">{d.num}</span>
                  <span className="join-domain-icon">{d.icon}</span>
                </div>
                <h3 className="join-domain-category">{d.category}</h3>
                <p className="join-domain-desc">{d.desc}</p>
                <ul className="join-domain-roles">
                  {d.roles.map((r) => (
                    <li key={r}>
                      <span className="join-domain-tick" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
                <span className="join-domain-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinGuide
