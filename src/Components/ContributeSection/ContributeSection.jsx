'use client'

import React from 'react';
import { FaHandshake, FaLightbulb } from 'react-icons/fa';
import SectionHeader from '../SectionHeader/SectionHeader';
import BlurCard from '../BlurCard/BlurCard';
import './ContributeSection.css';

const ways = [
  {
    icon: <FaHandshake size={32} />,
    title: 'Sponsor Us',
    desc: 'Want to support the next generation of cloud builders? Partner with AWS Cloud Clubs - SRMIST to sponsor events, workshops, or resources. Get visibility with 1000+ students.',
    cta: 'Get in Touch',
    link: 'mailto:sponsorship.awscc.srmist@gmail.com?subject=Sponsorship Inquiry',
  },
  {
    icon: <FaLightbulb size={32} />,
    title: 'Propose an Event',
    desc: 'Have an idea for a workshop, talk, or hackathon you want to conduct? We\'d love to hear it. Bring your expertise to our community.',
    cta: 'Suggest an Event',
    link: 'mailto:awscc.srmist@gmail.com?subject=Event Proposal',
  },
];

const ContributeSection = () => {
  return (
    <section className="contribute-section">
      <div className="contribute-container">
        <SectionHeader
          title="Work With Us"
          subtitle="Sponsor, collaborate, or bring your ideas to life"
        />
        <div className="contribute-grid">
          {ways.map((way, i) => (
            <BlurCard key={i} className="contribute-card">
              <div className="contribute-icon">{way.icon}</div>
              <h3 className="contribute-title">{way.title}</h3>
              <p className="para">{way.desc}</p>
              <a href={way.link} className="contribute-btn">
                {way.cta}
              </a>
            </BlurCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContributeSection;
