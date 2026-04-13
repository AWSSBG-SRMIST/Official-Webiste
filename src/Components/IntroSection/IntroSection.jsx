'use client'

import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import './IntroSection.css';

const IntroSection = () => {
  return (
    <section className="intro-section">
      <div className="intro-container">
        <div className="intro-text">
          <SectionHeader title="AWS Cloud Clubs" />
          <p className="para">
            AWS Cloud Clubs is a global network of student communities dedicated to cloud learning and innovation. At SRM Institute of Science and Technology, Kattankulathur, our chapter brings together passionate students eager to explore Amazon Web Services and build cloud-powered solutions.
          </p>
          <p className="para" style={{ marginTop: '16px' }}>
            We host workshops, hackathons, speaker sessions, and certification study groups — all designed to give you hands-on experience with AWS tools and services. Whether you're a beginner or an aspiring cloud architect, there's a place for you here.
          </p>
          <div className="intro-highlights">
            {['Hands-on Workshops', 'AWS Certification Prep', 'Networking Events', 'Industry Speakers'].map((item, i) => (
              <span key={i} className="intro-tag">{item}</span>
            ))}
          </div>
        </div>

        <div className="intro-logo-side">
          <div className="intro-logo-card">
            <div className="intro-logo-aws">
              <span>aws</span>
            </div>
            <div className="intro-logo-text">
              <span className="intro-logo-cloud">Cloud</span>
              <span className="intro-logo-clubs">Clubs</span>
            </div>
            <p className="intro-logo-caption">Member Chapter · SRM Kattankulathur</p>
            <div className="intro-logo-badge">Active Chapter 2024–25</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
