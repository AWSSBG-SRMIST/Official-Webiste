'use client'

import Link from 'next/link'
import { FaLinkedin, FaGithub, FaInstagram, FaArrowRight } from 'react-icons/fa'
import { SiMeetup } from 'react-icons/si'
import './Footer.css'

const socials = [
  { icon: <FaInstagram />, href: 'https://www.instagram.com/awscc.srmist/', label: 'Instagram' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/company/awscc-srmist/', label: 'LinkedIn' },
  { icon: <SiMeetup />, href: 'https://www.meetup.com/awscc-srmist/', label: 'Meetup' },
  { icon: <FaGithub />, href: 'https://github.com/AWSCC-SRMIST', label: 'GitHub' },
]

const columns = [
  {
    label: 'Navigate',
    links: [
      { href: '/', text: 'Home' },
      { href: '/events', text: 'Events' },
      { href: '/team', text: 'Team' },
      { href: '/join', text: 'Join' },
    ],
  },
  {
    label: 'Contact',
    links: [
      { href: 'mailto:awscc.srmist@gmail.com', text: 'awscc.srmist@gmail.com' },
      { href: 'mailto:sponsorship.awscc.srmist@gmail.com', text: 'Sponsorship' },
    ],
  },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-marquee">
        <div className="footer-marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span className="footer-marquee-item" key={i}>
              Think Big · Build Bigger · AWS Cloud Clubs · SRMIST · Est 2024 ·
            </span>
          ))}
        </div>
      </div>

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-brand-title">AWS<br />Cloud<br />Clubs</h2>
            <p className="footer-brand-sub">SRM Institute · Chennai</p>
          </div>

          <div className="footer-columns">
            {columns.map((c) => (
              <div className="footer-col" key={c.label}>
                <p className="footer-col-label">{c.label}</p>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="footer-col">
              <p className="footer-col-label">Join</p>
              <Link href="/join" className="footer-apply">
                Apply to ACC&apos;25
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-socials">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
              aria-label={s.label}
            >
              <span className="footer-social-icon">{s.icon}</span>
              <span>{s.label}</span>
            </a>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© {year} AWSCC — SRMIST · All rights reserved.</p>
          <p>Built by the Tech Team.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
