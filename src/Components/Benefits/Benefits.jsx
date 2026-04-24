'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
const useSafeLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
import { FaCertificate, FaLaptopCode, FaNetworkWired, FaRocket } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../../lib/SplitText'
import './Benefits.css'

const prospects = [
  {
    num: '01',
    icon: <FaCertificate />,
    title: 'Certifications',
    desc: 'Structured guidance, study tracks and peer support to earn globally recognised AWS certifications.',
    tag: 'Foundational → Professional',
  },
  {
    num: '02',
    icon: <FaLaptopCode />,
    title: 'Hands-on Projects',
    desc: 'Real cloud projects on EC2, S3, Lambda, RDS and more — a portfolio that recruiters actually open.',
    tag: 'Build · Deploy · Ship',
  },
  {
    num: '03',
    icon: <FaNetworkWired />,
    title: 'Network',
    desc: 'Connect with AWS community builders, industry professionals and fellow students across SRM and beyond.',
    tag: 'Mentors · Peers · Alumni',
  },
  {
    num: '04',
    icon: <FaRocket />,
    title: 'Launchpad',
    desc: 'Internship leads, hackathon slots and mentorship that compound into a real cloud career.',
    tag: 'Internships · Hackathons',
  },
]

const Benefits = () => {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const wrapRef = useRef(null)

  useSafeLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const wrap = wrapRef.current
    if (!section || !track || !wrap) return

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.benefit-card')
      const mm = gsap.matchMedia()

      mm.add('(min-width: 900px)', () => {
        cards.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.05,
            scrollTrigger: { trigger: section, start: 'top 70%' },
          })
        })
      })

      mm.add('(max-width: 899px)', () => {
        cards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          })
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="benefits-section" ref={sectionRef}>
      <div className="benefits-head section-shell">
        <div className="section-inner">
          <span className="eyebrow">02 · Why join</span>
          <SplitText
            as="h2"
            className="display-md benefits-title"
            html={'Everything you need<br/>to kickstart your cloud journey.'}
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
      </div>

      <div className="benefits-rail-wrap" ref={wrapRef}>
        <div className="benefits-rail" ref={trackRef}>
          {prospects.map((p) => (
            <article className="benefit-card" key={p.num}>
              <header className="benefit-card-top">
                <span className="benefit-num">{p.num}</span>
                <span className="benefit-icon">{p.icon}</span>
              </header>
              <h3 className="benefit-title">{p.title}</h3>
              <p className="benefit-desc">{p.desc}</p>
              <footer className="benefit-tag">{p.tag}</footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
