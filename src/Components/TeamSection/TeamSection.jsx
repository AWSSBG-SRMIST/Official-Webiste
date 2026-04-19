'use client'

import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import TeamCard from '../TeamCard/TeamCard';
import './TeamSection.css';

const teamData = {
  captain: {
    name: "Tanish Poddar",
    role: "Captain",
    photo: "/team/tanish.png", linkedIn: "", github: "",
  },

  executive: {
    name: "Siddharth Agarwal",
    role: "Executive",
    photo: "/team/siddharth.png", linkedIn: "", github: "",
  },

  directors: [
    { name: "Rohit Kumar",        role: "Technical Director",  photo: "/team/rohit-kumar.png",         linkedIn: "", github: "" },
    { name: "Animesh Rai",        role: "Corporate Director",  photo: "/team/animesh-rai.png",          linkedIn: "", github: "" },
    { name: "Praveen Saravanan", role: "Creatives Director",  photo: "/team/praveen-saravanan.png",   linkedIn: "", github: "" },
  ],

  domains: [
    {
      label: "Technical Domain",
      subdomains: [
        {
          label: "Dev",
          lead:   { name: "Aakarsh Kumar",           role: "Dev Lead",            photo: "/team/aakarsh-kumar.png",       linkedIn: "", github: "" },
          coLead: { name: "Nishant Ranjan",           role: "Dev Co-Lead",         photo: "/team/nishant-ranjan.png",      linkedIn: "", github: "" },
          members: [],
        },
        {
          label: "AI/ML",
          lead:   { name: "Akula Sidharth Naidu",    role: "AI/ML Lead",          photo: "/team/sidharth-akula.png",      linkedIn: "", github: "" },
          coLead: { name: "Hemish Jain",              role: "AI/ML Co-Lead",       photo: "/team/hemish-jain.png",         linkedIn: "", github: "" },
          members: [],
        },
        {
          label: "Cloud & DevOps",
          lead:   { name: "Desai Prathmesh Prakash", role: "Cloud & DevOps Lead", photo: "/team/prathmesh-desai.png",     linkedIn: "", github: "" },
          coLead: { name: "Nikhil Ganesh",            role: "Cloud Co-Lead",       photo: "/team/nikhil-ganesh.png",       linkedIn: "", github: "" },
          members: [],
        },
      ],
    },
    {
      label: "Corporate Domain",
      subdomains: [
        {
          label: "Events",
          lead:   { name: "Riya Kandhari",      role: "Events Lead",     photo: "/team/riya-kandhari.png",     linkedIn: "", github: "" },
          coLead: { name: "Atharv Raj Pandab",  role: "Events Co-Lead",  photo: "/team/atharv-pandab.png",     linkedIn: "", github: "" },
          members: [],
        },
        {
          label: "Public Relations",
          lead:   { name: "Mohak Dhawan",  role: "PR Lead",     photo: "/team/mohak-dhawan.png",    linkedIn: "", github: "" },
          coLead: { name: "Samidha Lade",  role: "PR Co-Lead",  photo: "/team/samidha-lade.png",    linkedIn: "", github: "" },
          members: [],
        },
        {
          label: "HR & Admin",
          lead:   { name: "Rohit Sunkari", role: "HR & Admin Lead",    photo: "/team/rohit-sunkari.png", linkedIn: "", github: "" },
          coLead: { name: "Rajni",          role: "HR & Admin Co-Lead", photo: "/team/rajni.png",          linkedIn: "", github: "" },
          members: [],
        },
        {
          label: "Sponsorship",
          lead:   { name: "Shreyash Mishra", role: "Sponsorship Lead",    photo: "/team/shreyash-mishra.png", linkedIn: "", github: "" },
          coLead: { name: "Siddhi Jadhav",   role: "Sponsorship Co-Lead", photo: "/team/siddhi-jadhav.png",   linkedIn: "", github: "" },
          members: [],
        },
      ],
    },
    {
      label: "Creatives Domain",
      subdomains: [
        {
          label: "Digital Design",
          lead:   { name: "Krish Nakul Gohel", role: "Design Lead",    photo: "/team/krish-gohel.jpg",    linkedIn: "", github: "" },
          coLead: { name: "Ritesh Rajpal",      role: "Design Co-Lead", photo: "/team/ritesh-rajpal.png",   linkedIn: "", github: "" },
          members: [],
        },
        {
          label: "Media",
          lead:   { name: "Piyush Kumar", role: "Media Lead",    photo: "/team/piyush-kumar.png",  linkedIn: "", github: "" },
          coLead: { name: "Arnav Thakur", role: "Media Co-Lead", photo: "/team/arnav-thakur.png",  linkedIn: "", github: "" },
          members: [],
        },
        {
          label: "UI/UX",
          lead:   { name: "", role: "UI/UX Lead",    photo: null, linkedIn: "", github: "" },
          coLead: { name: "", role: "UI/UX Co-Lead", photo: null, linkedIn: "", github: "" },
          members: [],
        },
      ],
    },
  ],
};

// teamData uses `role`; TeamCard expects `designation`
const card = ({ role, ...rest }) => ({ designation: role, ...rest });

const TeamSection = () => {
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
            <TeamCard {...card(teamData.captain)} />
          </div>
        </div>

        {/* Executive */}
        <div className="team-captain-row">
          <div className="team-captain-wrapper">
            <TeamCard {...card(teamData.executive)} />
          </div>
        </div>

        {/* Directors */}
        <div className="team-group">
          <h3 className="team-group-heading">Directors</h3>
          <div className="team-directors-grid">
            {teamData.directors.map((member, i) => (
              <TeamCard key={i} {...card(member)} />
            ))}
          </div>
        </div>

        {/* Domains */}
        {teamData.domains.map((domain) => (
          <div className="team-group" key={domain.label}>
            <h3 className="team-group-heading">{domain.label}</h3>

            {domain.subdomains.map((sub) => {
              const hasLead   = Boolean(sub.lead.name);
              const hasCoLead = Boolean(sub.coLead.name);
              if (!hasLead && !hasCoLead && sub.members.length === 0) return null;

              return (
                <div className="team-subdomain" key={sub.label}>
                  <h4 className="team-subdomain-heading">{sub.label}</h4>
                  <div className="team-leads-grid">
                    {hasLead   && <TeamCard {...card(sub.lead)} />}
                    {hasCoLead && <TeamCard {...card(sub.coLead)} />}
                    {sub.members.map((member, i) => (
                      <TeamCard key={i} {...card(member)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
