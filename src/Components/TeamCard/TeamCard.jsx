'use client'

import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import './TeamCard.css';

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join('');

const TeamCard = ({ name, designation, quote, linkedIn, github, photo }) => {
  return (
    <div className="team-card">
      <div className="team-photo-wrapper">
        {photo ? (
          <img src={photo} alt={name} className="team-photo" />
        ) : (
          <span className="team-initials">{getInitials(name)}</span>
        )}
      </div>
      <div className="team-info">
        <h4 className="team-name">{name}</h4>
        <p className="team-designation">{designation}</p>
        {quote && <p className="team-quote">"{quote}"</p>}
        {(linkedIn || github) && (
          <div className="team-links">
            {linkedIn && (
              <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="team-linkedin">
                <FaLinkedin size={20} />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="team-github">
                <FaGithub size={20} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
