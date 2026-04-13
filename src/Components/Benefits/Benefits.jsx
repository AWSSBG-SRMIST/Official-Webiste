'use client'

import React from 'react';
import { FaCertificate, FaLaptopCode, FaNetworkWired, FaRocket } from 'react-icons/fa';
import SectionHeader from '../SectionHeader/SectionHeader';
import GradientBoxIcon from '../GradientBoxIcon/GradientBoxIcon';
import './Benefits.css';

const prospects = [
  {
    icon: <FaCertificate />,
    title: 'AWS Certifications',
    desc: 'Get structured guidance, study resources, and peer support to earn globally recognized AWS certifications.',
  },
  {
    icon: <FaLaptopCode />,
    title: 'Hands-on Projects',
    desc: 'Work on real cloud projects using EC2, S3, Lambda, RDS, and more—building a portfolio that stands out.',
  },
  {
    icon: <FaNetworkWired />,
    title: 'Professional Network',
    desc: 'Connect with AWS community builders, industry professionals, and fellow students from SRM and beyond.',
  },
  {
    icon: <FaRocket />,
    title: 'Career Launchpad',
    desc: 'Access internship leads, hackathon opportunities, and mentorship to accelerate your cloud career.',
  },
];

const Benefits = () => {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <SectionHeader
          title="Why Join Us?"
          subtitle="Everything you need to kickstart your cloud journey"
        />
        <div className="benefits-grid">
          {prospects.map((item, i) => (
            <div className="benefit-card" key={i}>
              <GradientBoxIcon size={56}>{item.icon}</GradientBoxIcon>
              <div className="benefit-content">
                <h3 className="benefit-title">{item.title}</h3>
                <p className="para benefit-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
