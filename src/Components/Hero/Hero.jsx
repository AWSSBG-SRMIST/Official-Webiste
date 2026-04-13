'use client'

import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      {/* Background particles */}
      <div className="hero-bg-grid"></div>
      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Powered by{' '}
          <a
            href="https://builder.aws.com/community/cloud-clubs"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-badge-link"
          >
            AWS Cloud Clubs Community Program
          </a>
        </div>


        <h1 className="hero-title">
          <span className="hero-title-aws">AWS</span>{' '}
          <span className="hero-title-gradient">Cloud Clubs</span>
          <br />
          <span className="hero-title-gradient">SRMIST - KTR</span>
        </h1>

        <p className="hero-tagline">
          Think Big, Build Bigger.
        </p>

        <div className="hero-actions">
          <Link href="/join" className="hero-btn-primary">
            Join the Club <FaArrowRight />
          </Link>
        </div>

      </div>

      <div className="hero-illustration">
        <div className="hero-cloud-graphic">
          <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B836FE" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EB47FE" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B836FE" stopOpacity="0" />
                <stop offset="50%" stopColor="#FA46F2" stopOpacity="1" />
                <stop offset="100%" stopColor="#B836FE" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Main cloud */}
            <ellipse cx="200" cy="120" rx="80" ry="55" fill="url(#cloudGrad)" />
            <ellipse cx="150" cy="138" rx="55" ry="40" fill="url(#cloudGrad)" />
            <ellipse cx="250" cy="138" rx="55" ry="40" fill="url(#cloudGrad)" />

            {/* Connection lines */}
            <line x1="200" y1="175" x2="100" y2="230" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="200" y1="175" x2="200" y2="240" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="200" y1="175" x2="300" y2="230" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Server nodes */}
            <rect x="76" y="220" width="48" height="32" rx="6" fill="rgba(184,54,254,0.2)" stroke="#B836FE" strokeWidth="1.5" />
            <rect x="176" y="230" width="48" height="32" rx="6" fill="rgba(184,54,254,0.2)" stroke="#B836FE" strokeWidth="1.5" />
            <rect x="276" y="220" width="48" height="32" rx="6" fill="rgba(184,54,254,0.2)" stroke="#B836FE" strokeWidth="1.5" />

            {/* Labels */}
            <text x="100" y="241" textAnchor="middle" fill="#FA46F2" fontSize="8" fontFamily="monospace">EC2</text>
            <text x="200" y="251" textAnchor="middle" fill="#FA46F2" fontSize="8" fontFamily="monospace">S3</text>
            <text x="300" y="241" textAnchor="middle" fill="#FA46F2" fontSize="8" fontFamily="monospace">Lambda</text>

            {/* AWS logo text in cloud */}
            <text x="200" y="115" textAnchor="middle" fill="#FF9900" fontSize="18" fontWeight="bold" fontFamily="Arial">AWS</text>
            <text x="200" y="135" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">Cloud Clubs - SRMIST</text>

            {/* Orbiting dots */}
            <circle cx="130" cy="85" r="4" fill="#B836FE" opacity="0.7" />
            <circle cx="270" cy="90" r="3" fill="#FA46F2" opacity="0.5" />
            <circle cx="155" cy="60" r="2.5" fill="#EB47FE" opacity="0.6" />
            <circle cx="240" cy="55" r="3.5" fill="#A761FF" opacity="0.5" />
          </svg>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span></span>
      </div>
    </section>
  );
};

export default Hero;
