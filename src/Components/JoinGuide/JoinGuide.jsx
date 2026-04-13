'use client'

import React from 'react';
import { FaCode, FaBullhorn, FaPalette } from 'react-icons/fa';
import './JoinGuide.css';

const domains = [
  {
    icon: <FaCode size={22} />,
    category: 'Tech',
    color: '#B836FE',
    roles: ['Development', 'AI / ML', 'Cloud & DevOps'],
  },
  {
    icon: <FaBullhorn size={22} />,
    category: 'Corporate & Events',
    color: '#FF9900',
    roles: ['Events', 'Public Relations', 'Sponsorship', 'HR & Admin'],
  },
  {
    icon: <FaPalette size={22} />,
    category: 'Creatives',
    color: '#FA46F2',
    roles: ['Digital Design', 'Media', 'UI / UX'],
  },
];

const JoinGuide = () => {
  return (
    <section className="join-section">
      <div className="join-container">

        <h1 className="join-coming-soon">Recruitments Starting Soon</h1>
        <p className="join-coming-sub">Stay tuned — follow us to know when applications open.</p>

        <p className="join-section-label">Our Domains</p>
        <div className="join-domains-grid">
          {domains.map((d, i) => (
            <div key={i} className="join-domain-card" style={{ '--domain-color': d.color }}>
              <div className="join-domain-icon" style={{ background: `${d.color}18`, color: d.color }}>
                {d.icon}
              </div>
              <h3 className="join-domain-category">{d.category}</h3>
              <div className="join-domain-roles">
                {d.roles.map((r, j) => (
                  <span key={j} className="join-domain-role">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default JoinGuide;
