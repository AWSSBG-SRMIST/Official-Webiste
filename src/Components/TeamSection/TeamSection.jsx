'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TeamCard from '../TeamCard/TeamCard'
import './TeamSection.css'

const teamData = {
  captain: {
    name: 'Tanish Poddar',
    role: 'Captain',
    photo: '/team/tanish.png', linkedIn: '', github: '',
  },
  executive: {
    name: 'Siddharth Agarwal',
    role: 'Executive',
    photo: '/team/siddharth.png', linkedIn: '', github: '',
  },
  directors: [
    { name: 'Rohit Kumar', role: 'Technical Director', photo: '/team/rohit-kumar.png', linkedIn: '', github: '' },
    { name: 'Animesh Rai', role: 'Corporate Director', photo: '/team/animesh-rai.png', linkedIn: '', github: '' },
    { name: 'Praveen Saravanan', role: 'Creatives Director', photo: '/team/praveen-saravanan.png', linkedIn: '', github: '' },
  ],
  domains: [
    {
      label: 'Technical Domain',
      subdomains: [
        {
          label: 'Dev',
          lead: { name: 'Aakarsh Kumar', role: 'Dev Lead', photo: '/team/aakarsh-kumar.png', linkedIn: '', github: '' },
          coLead: { name: 'Nishant Ranjan', role: 'Dev Co-Lead', photo: '/team/nishant-ranjan.png', linkedIn: '', github: '' },
          members: [],
        },
        {
          label: 'AI/ML',
          lead: { name: 'Akula Sidharth Naidu', role: 'AI/ML Lead', photo: '/team/sidharth-akula.png', linkedIn: '', github: '' },
          coLead: { name: 'Hemish Jain', role: 'AI/ML Co-Lead', photo: '/team/hemish-jain.png', linkedIn: '', github: '' },
          members: [],
        },
        {
          label: 'Cloud & DevOps',
          lead: { name: 'Desai Prathmesh Prakash', role: 'Cloud & DevOps Lead', photo: '/team/prathmesh-desai.png', linkedIn: '', github: '' },
          coLead: { name: 'Nikhil Ganesh', role: 'Cloud Co-Lead', photo: '/team/nikhil-ganesh.png', linkedIn: '', github: '' },
          members: [],
        },
      ],
    },
    {
      label: 'Corporate Domain',
      subdomains: [
        {
          label: 'Events',
          lead: { name: 'Riya Kandhari', role: 'Events Lead', photo: '/team/riya-kandhari.png', linkedIn: '', github: '' },
          coLead: { name: 'Atharv Raj Pandab', role: 'Events Co-Lead', photo: '/team/atharv-pandab.png', linkedIn: '', github: '' },
          members: [],
        },
        {
          label: 'Public Relations',
          lead: { name: 'Mohak Dhawan', role: 'PR Lead', photo: '/team/mohak-dhawan.png', linkedIn: '', github: '' },
          coLead: { name: 'Samidha Lade', role: 'PR Co-Lead', photo: '/team/samidha-lade.png', linkedIn: '', github: '' },
          members: [],
        },
        {
          label: 'HR & Admin',
          lead: { name: 'Rohit Sunkari', role: 'HR & Admin Lead', photo: '/team/rohit-sunkari.png', linkedIn: '', github: '' },
          coLead: { name: 'Rajni', role: 'HR & Admin Co-Lead', photo: '/team/rajni.png', linkedIn: '', github: '' },
          members: [],
        },
        {
          label: 'Sponsorship',
          lead: { name: 'Shreyash Mishra', role: 'Sponsorship Lead', photo: '/team/shreyash-mishra.png', linkedIn: '', github: '' },
          coLead: { name: 'Siddhi Jadhav', role: 'Sponsorship Co-Lead', photo: '/team/siddhi-jadhav.png', linkedIn: '', github: '' },
          members: [],
        },
      ],
    },
    {
      label: 'Creatives Domain',
      subdomains: [
        {
          label: 'Digital Design',
          lead: { name: 'Krish Nakul Gohel', role: 'Design Lead', photo: '/team/krish-gohel.jpg', linkedIn: '', github: '' },
          coLead: { name: 'Ritesh Rajpal', role: 'Design Co-Lead', photo: '/team/ritesh-rajpal.png', linkedIn: '', github: '' },
          members: [],
        },
        {
          label: 'Media',
          lead: { name: 'Piyush Kumar', role: 'Media Lead', photo: '/team/piyush-kumar.png', linkedIn: '', github: '' },
          coLead: { name: 'Arnav Thakur', role: 'Media Co-Lead', photo: '/team/arnav-thakur.png', linkedIn: '', github: '' },
          members: [],
        },
        {
          label: 'UI/UX',
          lead: { name: '', role: 'UI/UX Lead', photo: null, linkedIn: '', github: '' },
          coLead: { name: '', role: 'UI/UX Co-Lead', photo: null, linkedIn: '', github: '' },
          members: [],
        },
      ],
    },
  ],
}

const card = ({ role, ...rest }) => ({ designation: role, ...rest })

// One entry per leadership group + one per subdomain (skip empty)
const buildGroups = () => {
  const groups = [
    {
      num: '01',
      label: 'Leadership',
      domainTag: null,
      subLabel: 'Captain & Executive',
      members: [teamData.captain, teamData.executive],
    },
    {
      num: '02',
      label: 'Directors',
      domainTag: null,
      subLabel: 'Domain Directors',
      members: teamData.directors,
    },
  ]

  let counter = 3
  const domainShort = { 'Technical Domain': 'Technical', 'Corporate Domain': 'Corporate', 'Creatives Domain': 'Creatives' }

  teamData.domains.forEach((domain) => {
    domain.subdomains.forEach((sub) => {
      const hasLead = Boolean(sub.lead.name)
      const hasCoLead = Boolean(sub.coLead.name)
      if (!hasLead && !hasCoLead) return
      const members = []
      if (hasLead) members.push(sub.lead)
      if (hasCoLead) members.push(sub.coLead)
      groups.push({
        num: String(counter).padStart(2, '0'),
        label: sub.label,
        domainTag: domainShort[domain.label] ?? domain.label,
        subLabel: null,
        members,
      })
      counter++
    })
  })

  return groups
}

const GROUPS = buildGroups()
const N = GROUPS.length

const TeamSection = () => {
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const dialRef = useRef(null)
  const cardRefs = useRef([])
  const labelNumRef = useRef(null)
  const labelNameRef = useRef(null)
  const domainRef = useRef(null)
  const activeIdxRef = useRef(0)

  // Header word animation
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const teamWords = gsap.utils.toArray('.team-word', section)
      gsap.set(teamWords, { yPercent: 120, opacity: 0 })
      gsap.to(teamWords, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.05,
        ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      })
      gsap.from('.team-lede', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  // Dial scroll animation (desktop only)
  useEffect(() => {
    const sticky = stickyRef.current
    if (!sticky) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      cardRefs.current.forEach((cardEl, i) => {
        if (!cardEl) return
        gsap.set(cardEl, { y: i === 0 ? '0%' : '100%' })
      })

      const st = ScrollTrigger.create({
        trigger: sticky,
        start: 'top top',
        end: `+=${(N - 1) * 80}vh`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress
          const span = N - 1

          if (dialRef.current) {
            gsap.set(dialRef.current, { rotation: -80 * progress })
          }

          cardRefs.current.forEach((cardEl, i) => {
            if (!cardEl) return
            // localP: -inf → +inf, 0 = this card is the active one
            const localP = progress * span - i

            let y
            if (localP < -1) {
              y = 100
            } else if (localP < 0) {
              // Entering from below with cubic ease-out
              const t = localP + 1
              const eased = 1 - Math.pow(1 - t, 3)
              y = 100 * (1 - eased)
            } else if (localP < 1) {
              // Slowly drifting upward as next card enters
              y = localP * -15
            } else {
              y = -15
            }

            gsap.set(cardEl, { y: `${y}%` })
          })

          const activeIdx = Math.min(Math.round(progress * span), span)
          if (activeIdx !== activeIdxRef.current) {
            activeIdxRef.current = activeIdx
            const g = GROUPS[activeIdx]
            if (labelNumRef.current) labelNumRef.current.textContent = g.num
            if (labelNameRef.current) labelNameRef.current.textContent = g.label
            if (domainRef.current) domainRef.current.textContent = g.domainTag ?? 'AWSCC · TEAM'
          }
        },
      })

      return () => st.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="team-section" ref={sectionRef}>
      {/* Header */}
      <div className="team-head-wrap">
        <div className="section-inner">
          <div className="team-head">
            <span className="eyebrow">The roster · ACC&apos;25</span>
            <h1 className="display-md team-title">
              <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                <span className="team-word" style={{ display: 'inline-block' }}>The&nbsp;</span>
                <span className="team-word" style={{ display: 'inline-block' }}>people&nbsp;</span>
                <span className="team-word" style={{ display: 'inline-block' }}>powering</span>
              </div>
              <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                <span className="team-word" style={{ display: 'inline-block' }}>AWSCC&nbsp;</span>
                <span className="team-word" style={{ display: 'inline-block' }}>—&nbsp;</span>
                <span className="team-word" style={{ display: 'inline-block' }}>SRMIST.</span>
              </div>
            </h1>
            <p className="para team-lede">
              Captains, directors, leads, co-leads. The humans who keep the workshops running, the
              swag landing, and the late-night debugs honest.
            </p>
          </div>
        </div>
      </div>

      {/* ── Desktop: dial scroll experience ── */}
      <div ref={stickyRef} className="ts-sticky">

          {/* Left panel: rotating dial + indicator */}
          <div className="ts-dial-panel">
            <div ref={dialRef} className="ts-dial">
              <div className="ts-ring ts-ring-1" />
              <div className="ts-ring ts-ring-2" />
              <div className="ts-ring ts-ring-3" />
              <div className="ts-ring ts-ring-4" />
              {Array.from({ length: 72 }).map((_, i) => (
                <div
                  key={i}
                  className={`ts-tick${i % 6 === 0 ? ' ts-tick--major' : ''}`}
                  style={{ transform: `rotate(${i * 5}deg)` }}
                />
              ))}
            </div>

            <div className="ts-indicator">
              <div className="ts-indicator-text">
                <span ref={domainRef} className="ts-indicator-eyebrow">AWSCC · TEAM</span>
                <div className="ts-indicator-main">
                  <span ref={labelNumRef} className="ts-indicator-num">{GROUPS[0].num}</span>
                  <span ref={labelNameRef} className="ts-indicator-name">{GROUPS[0].label}</span>
                </div>
              </div>
              <div className="ts-bracket">
                <div className="ts-bracket-rail" />
                <div className="ts-bracket-pip" />
              </div>
            </div>
          </div>

          {/* Right panel: stacked group cards */}
          <div className="ts-cards-panel">
            {GROUPS.map((group, i) => (
              <div
                key={group.num}
                ref={(el) => { cardRefs.current[i] = el }}
                className="ts-card"
                style={{ zIndex: i }}
              >
                <div className="ts-card-inner">
                  <div className="ts-card-hd">
                    <span className="ts-card-num">{group.num}</span>
                    <h3 className="ts-card-title">{group.label}</h3>
                    <div className="ts-card-dots">
                      <span /><span /><span className="ts-dot-accent" />
                    </div>
                  </div>
                  <div className="ts-card-body" data-lenis-prevent>
                    {group.domainTag && (
                      <p className="ts-domain-tag">{group.domainTag}</p>
                    )}
                    <div className="ts-subdomain">
                      {group.subLabel && (
                        <p className="ts-sublabel">{group.subLabel}</p>
                      )}
                      <div className="ts-grid">
                        {group.members.map((m, j) => (
                          <TeamCard key={j} {...card(m)} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* ── Mobile fallback: plain groups ── */}
      <div className="ts-mobile">
        <div className="ts-mobile-inner">
          <div className="team-group">
            <div className="team-group-head">
              <span className="team-group-num">01</span>
              <h3 className="team-group-heading">Leadership</h3>
            </div>
            <div className="team-leads-grid">
              <TeamCard {...card(teamData.captain)} />
              <TeamCard {...card(teamData.executive)} />
            </div>
          </div>

          <div className="team-group">
            <div className="team-group-head">
              <span className="team-group-num">02</span>
              <h3 className="team-group-heading">Directors</h3>
            </div>
            <div className="team-directors-grid">
              {teamData.directors.map((m, i) => (
                <TeamCard key={i} {...card(m)} />
              ))}
            </div>
          </div>

          {teamData.domains.map((domain, idx) => (
            <div className="team-group" key={domain.label}>
              <div className="team-group-head">
                <span className="team-group-num">{String(idx + 3).padStart(2, '0')}</span>
                <h3 className="team-group-heading">{domain.label}</h3>
              </div>
              {domain.subdomains.map((sub) => {
                const hasLead = Boolean(sub.lead.name)
                const hasCoLead = Boolean(sub.coLead.name)
                if (!hasLead && !hasCoLead && sub.members.length === 0) return null
                return (
                  <div className="team-subdomain" key={sub.label}>
                    <h4 className="team-subdomain-heading">
                      <span className="team-sub-tick" aria-hidden="true" />
                      {sub.label}
                    </h4>
                    <div className="team-leads-grid">
                      {hasLead && <TeamCard {...card(sub.lead)} />}
                      {hasCoLead && <TeamCard {...card(sub.coLead)} />}
                      {sub.members.map((m, i) => (
                        <TeamCard key={i} {...card(m)} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection
