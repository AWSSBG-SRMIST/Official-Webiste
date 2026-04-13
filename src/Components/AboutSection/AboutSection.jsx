'use client'

import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-col-text">
          <div className="about-block">
            <h3 className="side-head about-subhead">Who We Are</h3>
            <p className="para">
              AWS Cloud Clubs - SRMIST is a student-led community for builders exploring the intersection of cloud computing, software development, AI/ML, and DevOps within the AWS ecosystem. Through hands-on workshops, real-world projects, and technical sessions, we enable students to learn, build, and deploy modern cloud-native systems. Our focus is simple: turn curious students into capable builders by giving them the environment, tools, and community to experiment and innovate.
            </p>
          </div>

          <div className="about-block" style={{ marginTop: '32px' }}>
            <h3 className="side-head about-subhead">What We Do</h3>
            <p className="para">
              We organise hands-on workshops on AWS services, certification bootcamps for AWS Cloud Practitioner and beyond, industry speaker sessions, hackathons, and networking events — all designed to bridge the gap between academic learning and industry needs.
            </p>
            <div className="about-tags">
              {['Workshops', 'Hackathons', 'Speaker Sessions', 'Cert Bootcamps', 'Networking', 'Projects'].map((t, i) => (
                <span key={i} className="about-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-col-visual">
          <div className="about-visual-card">
            <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="about-svg">
              <defs>
                <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B836FE" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#EB47FE" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="aLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B836FE" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FA46F2" stopOpacity="1" />
                  <stop offset="100%" stopColor="#B836FE" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Cloud body */}
              <ellipse cx="170" cy="110" rx="75" ry="52" fill="url(#aGrad)" />
              <ellipse cx="122" cy="128" rx="52" ry="38" fill="url(#aGrad)" />
              <ellipse cx="218" cy="128" rx="52" ry="38" fill="url(#aGrad)" />
              {/* AWS text */}
              <text x="170" y="106" textAnchor="middle" fill="#FF9900" fontSize="20" fontWeight="bold" fontFamily="Arial">AWS</text>
              <text x="170" y="126" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="monospace">Cloud Clubs · SRMIST</text>
              {/* Lines to services */}
              <line x1="170" y1="166" x2="60" y2="220" stroke="url(#aLine)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="170" y1="166" x2="170" y2="228" stroke="url(#aLine)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="170" y1="166" x2="280" y2="220" stroke="url(#aLine)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="60" y1="220" x2="60" y2="245" stroke="url(#aLine)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="280" y1="220" x2="280" y2="245" stroke="url(#aLine)" strokeWidth="1" strokeDasharray="3 3" />
              {/* Service nodes */}
              <rect x="34" y="210" width="52" height="30" rx="6" fill="rgba(184,54,254,0.15)" stroke="#B836FE" strokeWidth="1.5" />
              <rect x="144" y="218" width="52" height="30" rx="6" fill="rgba(184,54,254,0.15)" stroke="#B836FE" strokeWidth="1.5" />
              <rect x="254" y="210" width="52" height="30" rx="6" fill="rgba(184,54,254,0.15)" stroke="#B836FE" strokeWidth="1.5" />
              <rect x="34" y="245" width="52" height="26" rx="6" fill="rgba(184,54,254,0.1)" stroke="rgba(184,54,254,0.4)" strokeWidth="1" />
              <rect x="254" y="245" width="52" height="26" rx="6" fill="rgba(184,54,254,0.1)" stroke="rgba(184,54,254,0.4)" strokeWidth="1" />
              <text x="60" y="230" textAnchor="middle" fill="#FA46F2" fontSize="9" fontFamily="monospace">EC2</text>
              <text x="170" y="238" textAnchor="middle" fill="#FA46F2" fontSize="9" fontFamily="monospace">Lambda</text>
              <text x="280" y="230" textAnchor="middle" fill="#FA46F2" fontSize="9" fontFamily="monospace">S3</text>
              <text x="60" y="262" textAnchor="middle" fill="#A761FF" fontSize="8" fontFamily="monospace">RDS</text>
              <text x="280" y="262" textAnchor="middle" fill="#A761FF" fontSize="8" fontFamily="monospace">CloudFront</text>
              {/* Orbiting dots */}
              <circle cx="105" cy="76" r="4" fill="#B836FE" opacity="0.7" />
              <circle cx="238" cy="80" r="3" fill="#FA46F2" opacity="0.5" />
              <circle cx="128" cy="52" r="2.5" fill="#EB47FE" opacity="0.6" />
              <circle cx="210" cy="48" r="3" fill="#A761FF" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
