'use client'

import React from 'react';
import { FaUsers, FaCalendarCheck, FaBriefcase } from 'react-icons/fa';
import SectionHeader from '../SectionHeader/SectionHeader';
import StatsCard from '../StatsCard/StatsCard';
import './StatsSection.css';

const stats = [
  { end: 200, suffix: '+', label: 'Community Members', icon: <FaUsers /> },
  { end: 10, suffix: '+', label: 'Events Conducted', icon: <FaCalendarCheck /> },
  { end: 50, suffix: '+', label: 'Opportunities Shared', icon: <FaBriefcase /> },
];

const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <SectionHeader
          title="Our Community"
          subtitle="Growing stronger every day at SRM Kattankulathur"
        />
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
