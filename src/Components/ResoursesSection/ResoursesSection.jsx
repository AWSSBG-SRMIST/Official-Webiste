'use client'

import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import { FaAward, FaCalendarAlt, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import BlurCard from '../BlurCard/BlurCard';
import './ResoursesSection.css';

const weeklyPlan = [
  {
    week: 'Week 1',
    title: 'Cloud Foundations',
    topics: ['What is Cloud Computing?', 'AWS Global Infrastructure', 'Core AWS Services Overview', 'IAM & Security Basics'],
    resources: [
      { label: 'AWS Cloud Practitioner Essentials', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials' },
      { label: 'AWS Free Tier Account Setup', url: 'https://aws.amazon.com/free/' },
    ],
  },
  {
    week: 'Week 2',
    title: 'Core Services Deep Dive',
    topics: ['Amazon EC2 & Compute', 'Amazon S3 & Storage', 'Amazon RDS & Databases', 'Networking (VPC, CloudFront)'],
    resources: [
      { label: 'AWS Documentation', url: 'https://docs.aws.amazon.com/' },
      { label: 'AWS Hands-On Tutorials', url: 'https://aws.amazon.com/getting-started/hands-on/' },
    ],
  },
  {
    week: 'Week 3',
    title: 'Cloud Architecture & Pricing',
    topics: ['Well-Architected Framework', 'Pricing & Billing', 'AWS Support Plans', 'Shared Responsibility Model'],
    resources: [
      { label: 'AWS Pricing Calculator', url: 'https://calculator.aws/pricing/2/home' },
      { label: 'AWS Well-Architected Labs', url: 'https://www.wellarchitectedlabs.com/' },
    ],
  },
  {
    week: 'Week 4',
    title: 'Exam Prep & Practice',
    topics: ['Practice Tests', 'Exam Tips & Strategies', 'Review Weak Areas', 'Schedule Your Exam'],
    resources: [
      { label: 'Official Practice Question Set', url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/14050/aws-certified-cloud-practitioner-official-practice-question-set-clf-c02-english' },
      { label: 'AWS Certification Portal', url: 'https://aws.amazon.com/certification/' },
    ],
  },
];

const ResoursesSection = () => {
  return (
    <section className="resources-section">
      <div className="resources-container">
        {/* Hero Badge */}
        <div className="resources-hero">
          <div className="cert-badge-wrapper">
            <div className="cert-badge">
              <FaAward size={48} />
              <div className="cert-badge-text">
                <span className="cert-badge-title">AWS Certified</span>
                <span className="cert-badge-subtitle">Cloud Practitioner</span>
                <span className="cert-badge-code">CLF-C02</span>
              </div>
            </div>
          </div>
          <div className="resources-hero-text">
            <SectionHeader title="Get Certified" subtitle="Your 30-Day AWS Cloud Practitioner Roadmap" />
            <p className="para">
              The AWS Certified Cloud Practitioner certification is the perfect starting point for your cloud journey. It validates foundational knowledge of AWS cloud concepts, security, pricing, and support. Our 30-day plan is designed specifically for SRM students.
            </p>
            <div className="resources-quick-links">
              <a href="https://aws.amazon.com/certification/certified-cloud-practitioner/" target="_blank" rel="noopener noreferrer" className="resources-quick-link">
                <FaExternalLinkAlt /> Exam Guide
              </a>
              <a href="https://explore.skillbuilder.aws" target="_blank" rel="noopener noreferrer" className="resources-quick-link">
                <FaExternalLinkAlt /> AWS Skill Builder
              </a>
              <a href="https://aws.amazon.com/free/" target="_blank" rel="noopener noreferrer" className="resources-quick-link">
                <FaExternalLinkAlt /> AWS Free Tier
              </a>
            </div>
          </div>
        </div>

        {/* 30-Day Challenge */}
        <div className="challenge-section">
          <div className="challenge-header">
            <FaCalendarAlt />
            <h2 className="challenge-title">30-Day Challenge</h2>
          </div>
          <p className="para challenge-desc">
            Dedicate 1–2 hours daily for 30 days. Complete this plan and you'll be ready to ace the CLF-C02 exam. Each week builds on the last.
          </p>
        </div>

        {/* Weekly Breakdown */}
        <div className="weekly-grid">
          {weeklyPlan.map((week, i) => (
            <BlurCard key={i} className="weekly-card">
              <div className="weekly-header">
                <span className="weekly-badge">{week.week}</span>
                <h3 className="weekly-title">{week.title}</h3>
              </div>
              <ul className="weekly-topics">
                {week.topics.map((topic, j) => (
                  <li key={j} className="weekly-topic">
                    <FaCheckCircle className="topic-check" />
                    {topic}
                  </li>
                ))}
              </ul>
              <div className="weekly-resources">
                <p className="weekly-resources-label">Resources:</p>
                {week.resources.map((res, j) => (
                  <a key={j} href={res.url} target="_blank" rel="noopener noreferrer" className="weekly-resource-link">
                    <FaExternalLinkAlt /> {res.label}
                  </a>
                ))}
              </div>
            </BlurCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResoursesSection;
