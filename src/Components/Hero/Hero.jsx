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
          Powered by{''}
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
        <div className="hero-logo-wrap">
          <img src="/logo-nobg.png" alt="AWS Cloud Clubs SRMIST" className="hero-logo-img" />
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span></span>
      </div>
    </section>
  );
};

export default Hero;
