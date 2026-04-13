'use client'

import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import TeamCard from '../TeamCard/TeamCard';
import './TeamSection.css';

const teamMembers = [
  {
    name: 'Club Captain',
    designation: 'Chapter Captain',
    quote: 'Building the cloud community at SRM, one workshop at a time.',
    linkedIn: 'https://linkedin.com',
    photo: null,
  },
  {
    name: 'Tech Lead',
    designation: 'Technical Executive',
    quote: 'Turning complex cloud concepts into hands-on experiences.',
    linkedIn: 'https://linkedin.com',
    photo: null,
  },
  {
    name: 'Events Lead',
    designation: 'Events Executive',
    quote: 'Every event is an opportunity to spark curiosity.',
    linkedIn: 'https://linkedin.com',
    photo: null,
  },
  {
    name: 'Design Lead',
    designation: 'Creative Executive',
    quote: 'Designing experiences that inspire and connect.',
    linkedIn: 'https://linkedin.com',
    photo: null,
  },
  {
    name: 'Community Lead',
    designation: 'Community Executive',
    quote: 'Community is our greatest cloud service.',
    linkedIn: 'https://linkedin.com',
    photo: null,
  },
];

const TeamSection = () => {
  const [captain, ...leads] = teamMembers;

  return (
    <section className="team-section">
      <div className="team-container">
        <SectionHeader
          title="Meet the Team"
          subtitle="The people powering AWS Cloud Clubs - SRMIST"
        />

        {/* Captain */}
        <div className="team-captain-row">
          <div className="team-captain-wrapper">
            <TeamCard {...captain} />
          </div>
        </div>

        {/* Leads */}
        <div className="team-leads-grid">
          {leads.map((member, i) => (
            <TeamCard key={i} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
