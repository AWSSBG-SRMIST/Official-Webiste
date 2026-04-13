'use client'

import React from 'react';
import { FaLinkedin } from 'react-icons/fa';
import GradientProfileIcon from '../GradientProfileIcon/GradientProfileIcon';
import './TeamCard.css';

const TeamCard = ({ name, designation, quote, linkedIn, photo }) => {
  return (
    <div className="team-card">
      <div className="team-photo-wrapper">
        {photo ? (
          <img src={photo} alt={name} className="team-photo" />
        ) : (
          <GradientProfileIcon size={80} />
        )}
      </div>
      <div className="team-info">
        <h4 className="team-name">{name}</h4>
        <p className="team-designation">{designation}</p>
        {quote && <p className="team-quote">"{quote}"</p>}
        {linkedIn && (
          <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="team-linkedin">
            <FaLinkedin size={20} />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
