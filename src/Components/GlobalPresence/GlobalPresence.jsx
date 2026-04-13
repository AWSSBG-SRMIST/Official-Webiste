'use client'

import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import StatsCard from '../StatsCard/StatsCard';
import { FaUsers, FaGlobe, FaFlag } from 'react-icons/fa';
import './GlobalPresence.css';

const globalStats = [
  { end: 21100, suffix: '+', label: 'Global Members', icon: <FaUsers /> },
  { end: 115, suffix: '+', label: 'Club Chapters', icon: <FaGlobe /> },
  { end: 37, suffix: '', label: 'Countries', icon: <FaFlag /> },
];

const GlobalPresence = () => {
  return (
    <section className="global-section">
      <div className="global-container">
        <SectionHeader
          title="Global Presence"
          subtitle="AWS Cloud Clubs is a worldwide community"
        />

        <div className="world-map-wrapper">
          <div className="world-map-svg-container">
            <svg viewBox="0 0 900 450" xmlns="http://www.w3.org/2000/svg" className="world-map-svg">
              {/* Simplified world map dots */}
              {generateDots().map((dot, i) => (
                <circle key={i} cx={dot.x} cy={dot.y} r="1.8" fill="rgba(184, 54, 254,0.35)" />
              ))}
              {/* Highlight dots for active regions */}
              {activeDots.map((dot, i) => (
                <circle key={`active-${i}`} cx={dot.x} cy={dot.y} r="5" fill="#B836FE" opacity="0.8">
                  <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
            <div className="world-map-label">
              <span>AWS Cloud Clubs Worldwide</span>
            </div>
          </div>
        </div>

        <div className="global-stats-grid">
          {globalStats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

function generateDots() {
  const dots = [];
  // North America
  for (let x = 90; x <= 220; x += 10) {
    for (let y = 60; y <= 200; y += 10) {
      if (Math.random() > 0.4) dots.push({ x: x + Math.random() * 5, y: y + Math.random() * 5 });
    }
  }
  // South America
  for (let x = 130; x <= 230; x += 10) {
    for (let y = 200; y <= 360; y += 10) {
      if (Math.random() > 0.45) dots.push({ x: x + Math.random() * 5, y: y + Math.random() * 5 });
    }
  }
  // Europe
  for (let x = 370; x <= 480; x += 10) {
    for (let y = 60; y <= 180; y += 10) {
      if (Math.random() > 0.35) dots.push({ x: x + Math.random() * 5, y: y + Math.random() * 5 });
    }
  }
  // Africa
  for (let x = 380; x <= 490; x += 10) {
    for (let y = 180; y <= 350; y += 10) {
      if (Math.random() > 0.4) dots.push({ x: x + Math.random() * 5, y: y + Math.random() * 5 });
    }
  }
  // Asia
  for (let x = 490; x <= 760; x += 10) {
    for (let y = 60; y <= 260; y += 10) {
      if (Math.random() > 0.35) dots.push({ x: x + Math.random() * 5, y: y + Math.random() * 5 });
    }
  }
  // Australia
  for (let x = 680; x <= 800; x += 10) {
    for (let y = 280; y <= 380; y += 10) {
      if (Math.random() > 0.45) dots.push({ x: x + Math.random() * 5, y: y + Math.random() * 5 });
    }
  }
  return dots;
}

const activeDots = [
  { x: 150, y: 130 }, // USA
  { x: 420, y: 120 }, // UK
  { x: 450, y: 130 }, // Germany
  { x: 580, y: 150 }, // India
  { x: 570, y: 160 }, // SRM (Chennai)
  { x: 720, y: 130 }, // China
  { x: 750, y: 180 }, // Japan
  { x: 740, y: 320 }, // Australia
  { x: 170, y: 280 }, // Brazil
  { x: 430, y: 220 }, // Nigeria
];

export default GlobalPresence;
