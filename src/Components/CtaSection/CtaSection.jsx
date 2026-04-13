'use client'

import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import './CtaSection.css';

const CtaSection = () => {
  return (
    <section className="cta-section">
      <div className="cta-glow"></div>
      <div className="cta-container">
        <div className="cta-badge">We are Open!</div>
        <h2 className="cta-title">Ready to Dive into the Cloud?</h2>
        <p className="cta-desc">
          Join AWS Cloud Clubs - SRMIST today and unlock a world of cloud opportunities. Membership is free for all SRM students.
        </p>
        <div className="cta-actions">
          <Link href="/join" className="cta-btn-primary">
            Join Now <FaArrowRight />
          </Link>
          <a
            href="https://www.meetup.com/aws-cloud-club-srm/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn-secondary"
          >
            Find us on Meetup
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
