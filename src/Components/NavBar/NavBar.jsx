'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import './NavBar.css'

const navLinks = [
  { path: '/', label: 'Home', num: '01' },
  { path: '/events', label: 'Events', num: '02' },
  { path: '/team', label: 'Team', num: '03' },
  { path: '/join', label: 'Join', num: '04' },
]

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!navRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, 
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2,
        }
      )
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`} ref={navRef}>
      <div className="nav-inner">
        <Link href="/" className="nav-brand" aria-label="AWS Cloud Clubs SRMIST home">
          <Image src="/logo.png" alt="" width={44} height={44} className="nav-logo" />
          <span className="nav-brand-text">
            <span className="nav-brand-line1">AWS Cloud Clubs</span>
            <span className="nav-brand-line2">SRMIST · KTR</span>
          </span>
        </Link>

        <ul className="nav-links">
          {navLinks.map(({ path, label, num }) => {
            const active = pathname === path
            return (
              <li key={path}>
                <Link href={path} className={`nav-link ${active ? 'is-active' : ''}`}>
                  <span className="nav-link-num">{num}</span>
                  <span className="nav-link-label">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <Link href="/join" className="nav-cta">
          <span>Apply</span>
          <span className="nav-cta-arrow" aria-hidden="true">→</span>
        </Link>

        <button
          className={`nav-burger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-mobile ${menuOpen ? 'is-open' : ''}`}>
        <ul>
          {navLinks.map(({ path, label, num }) => (
            <li key={path}>
              <Link href={path}>
                <span className="nav-mobile-num">{num}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
